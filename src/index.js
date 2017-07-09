import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


const verses = [
    ["너희는 그 은혜에 의하여 믿음으로 말미암아 구원을 받았으니 이것은 너희에게서 난 것이 아니요 하나님의 선물이라 행위에서 난 것이 아니니 이는 누구든지 자랑하지 못하게 함이라", "에베소서 2:8-9"],
    ["비판을 받지 아니하려거든 비판하지 말라 외식하는 자여 먼저 네 눈 속에서 들보를 빼어라 그 후에야 밝히 보고 형제의 눈 속에서 티를 빼리라", "마태복음 7:1,5"],
    ["모든 성경은 하나님의 감동으로 된 것으로 교훈과 책망과 바르게 함과 의로 교육하기에 유익하니 이는 하나님의 사람으로 온전하게 하며 모든 선한 일을 행할 능력을 갖추게 하려 함이라", "디모데후서 3:16-17"],
    ["우리가 무슨 일이든지 우리에게서 난 것 같이 스스로 만족할 것이 아니니 우리의 만족은 오직 하나님으로부터 나느니라 그가 또한 우리를 새 언약의 일꾼 되기에 만족하게 하셨으니 율법 조문으로 하지 아니하고 오직 영으로 함이니 율법 조문은 죽이는 것이요 영은 살리는 것이니라", "고린도후서 3:5-6"],
    ["사람이 감당할 시험 밖에는 너희가 당한 것이 없나니 오직 하나님은 미쁘사 너희가 감당하지 못할 시험 당함을 허락하지 아니하시고 시험 당할 즈음에 또한 피할 길을 내사 너희로 능히 감당하게 하시느니라", "고린도전서 10:13"]
];


function produceMemoryHelperList(verse) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    function isHidden(word) {
        return word.startsWith("-");
    }

    function mask(verseArray) {
        const words = verseArray.slice();

        const candidateIndex = words.map(function (word, i) {
            if (isHidden(word)) return -1;
            else return i;
        }).filter(index => index > -1);

        const theoreticalMaskCount = 3;
        const maxPossibleMaskCount = candidateIndex.length;
        const maskCount = theoreticalMaskCount > maxPossibleMaskCount ? maxPossibleMaskCount : theoreticalMaskCount;

        for (let i = 0; i < maskCount; i++) {
            const index = getRandomInt(0, candidateIndex.length);
            const maskIndex = candidateIndex[index];
            candidateIndex.splice(index, 1);
            words[maskIndex] = "-" + words[maskIndex];
        }

        return words;
    }


    function generate(verseArray, aggregator) {
        if (verseArray.every(isHidden)) {
            return aggregator;
        } else {
            const next = mask(verseArray);
            const copy = aggregator.slice();
            copy.push(next);
            return generate(next, copy);
        }
    }

    const verseArray = verse.split(/\s+/);

    return generate(verseArray, [verseArray]);
}

const db = verses.map(function (verse) {
   const words = verse[0];
   const location = verse[1];

   return {
       stages: produceMemoryHelperList(words),
       location: location
   };
});

console.log(db);


ReactDOM.render(<App verses={db} />, document.getElementById('root'));
registerServiceWorker();
