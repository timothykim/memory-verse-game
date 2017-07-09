import React, { Component } from 'react';
import './App.css';

// class App extends Component {
//     constructor(props) {
//         super(props);
//     }
// }

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {chapter: -1};
        this.handleVerseSelection = this.handleVerseSelection.bind(this);
        this.goHome = this.goHome.bind(this);
    }

    handleVerseSelection(chapter) {
        this.setState({chapter: chapter});
    }

    goHome() {
        this.setState({chapter: -1});
    }

    render() {
        let body;
        if (this.state.chapter === -1) {
            body =
                <div className="App-intro">
                    <VerseSelect verses={this.props.verses} onVerseSelection={this.handleVerseSelection} />
                </div>
        } else {
            body =
                <div className="Chapter">
                    <ChapterExercise verse={this.props.verses[this.state.chapter]} chapter={this.state.chapter} />
                </div>
        }

        return (
            <div className="App">
                <div className="App-header" onClick={this.goHome}>
                    <h2>Memory Verse</h2>
                </div>
                {body}
            </div>
        );
    }
}

class ChapterExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {stage: 0, wrong: false};
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    dismissAlert() {
        this.setState({
            stage: this.state.stage,
            wrong: false,
            success: false
        });
    }

    next() {
        const answer = this.props.verse.stages[this.state.stage].map(word => word.startsWith("-") ? word.substr(1) : word).join("").replace(/\s/g,'');
        const yourAnswer = this.refs.answer.innerText.replace(/\s/g,'');

        if (yourAnswer !== answer) {
            this.setState({
                stage: this.state.stage,
                wrong: true,
                success: false
            });
        } else {
            if (this.state.stage < this.props.verse.stages.length - 1) {
                this.setState({stage: this.state.stage + 1, wrong: false, success: false});
                this.refs.answer.innerHTML = "";
            } else if (this.state.stage === this.props.verse.stages.length -1) {
                this.setState({
                    stage: this.state.stage,
                    wrong: false,
                    success: true
                });
            }
        }
    }

    prev() {
        if (this.state.stage > 0) {
            console.log("prev");
            this.setState({stage: this.state.stage - 1})
        }
    }

    render() {
        const prev = <button type="button" onClick={this.prev}>Prev</button>;
        const next = <button type="button" onClick={this.next}>Next</button>;
        let nav = <div className="Navigation">{prev} {next}</div>;
        if (this.state.stage === 0) {
            nav = <div className="Navigation">{next}</div>
        }

        const alert = this.state.wrong ? <div className="Alert" onClick={this.dismissAlert}>요절이 정확하지 않습니다. 다시 시도 하세요.</div> : "";
        const success = this.state.success ? <div className="Success-alert" onClick={this.dismissAlert}>요절을 다 외우셨습니다. 축하드립니다!</div> : "";
        const words = this.props.verse.stages[this.state.stage];
        const wordsRendering =
            words.map(word => word.startsWith("-")
                                ? [<span className="Blank" key={word}>{word.substr(1)}</span>, " "]
                                : [word, " "])
                 .reduce((x,y) => x.concat(y), []);

        return (
            <div>
                <h2>제 {this.props.chapter + 1} 과</h2>
                <h3>Stage {this.state.stage + 1} / {this.props.verse.stages.length} </h3>
                <div className="Answer-wrapper">
                    <div ref="answer" contentEditable={true} className="Answer" />
                </div>
                <div className="Problem">
                    {wordsRendering}
                    <h4>{this.props.verse.location}</h4>
                </div>
                {nav}
                {alert}
                {success}
            </div>
        );
    }
}


class VerseSelectOption extends Component {
    constructor(props) {
        super(props);
        this.handleVerseSelection = this.handleVerseSelection.bind(this);
    }

    handleVerseSelection() {
        this.props.onVerseSelection(this.props.chapter);
    }

    render() {
        const location = this.props.verse.location;
        const chapter = this.props.chapter;
        return (
            <li className="Verse-option" onClick={this.handleVerseSelection}>제 {chapter + 1} 과 - {location}</li>
        );
    }
}

class VerseSelect extends Component {
    constructor(props) {
        super(props);
        this.handleVerseSelection = this.handleVerseSelection.bind(this);
    }

    handleVerseSelection(chapter) {
        this.props.onVerseSelection(chapter);
    }

    render() {
        const options = [];
        const that = this;
        this.props.verses.forEach(function (verse, i) {
            options.push(<VerseSelectOption verse={verse} chapter={i} key={i} onVerseSelection={this.handleVerseSelection} />);
        }, that);
        return (
            <div className="Verse-select">
                <ul>
                    {options}
                </ul>
            </div>
        );
    }
}

export default App;
