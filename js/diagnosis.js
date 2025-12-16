// 診断ロジック
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const form = document.getElementById('diagnosis-form');
    const introSection = document.getElementById('intro-section');
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    const currentQuestionSpan = document.getElementById('current-question');
    const progressFill = document.getElementById('progress-fill');

    let currentQuestion = 1;
    const totalQuestions = 5;
    const answers = {};

    // 診断結果の定義
    const results = {
        A: {
            title: '慎重に考え続けている状態',
            description: 'あなたは、相手のことをもっと知りたい、時間をかけて判断したいという気持ちが強いようです。',
            detail: 'これは、人生のパートナー選択に真摯に向き合っている証です。焦らず、自分のペースで考え続けることが大切です。'
        },
        B: {
            title: '違和感を大切にしている状態',
            description: '理由ははっきりしなくても、「何か違う」という感覚を感じ取っているようです。',
            detail: 'その違和感は、あなたの内面からのメッセージかもしれません。それが何なのかを、ゆっくり言葉にしていく過程が大切です。'
        },
        C: {
            title: '頭と気持ちが少しずれている状態',
            description: '相手が「良い人」だと理性では分かるのに、気持ちがついていかない。そのズレを感じているようです。',
            detail: 'その違和感は無視できません。頭と心の声を、もう一度聞き直す必要があるかもしれません。'
        },
        D: {
            title: '判断を保留している状態',
            description: '今は、決めるべき時ではないと感じているようです。',
            detail: 'その判断も、あなた自身の大切な選択です。焦らず、自分のタイミングを信じてください。'
        }
    };

    // 診断開始
    startBtn.addEventListener('click', function() {
        introSection.style.display = 'none';
        quizSection.style.display = 'block';
        showQuestion(1);
    });

    // 次へボタン
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 現在の質問の回答を保存
        const selectedOption = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        if (!selectedOption) {
            alert('選択肢を選んでください');
            return;
        }
        
        answers[`q${currentQuestion}`] = selectedOption.value;

        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            // 診断完了
            showResult();
        }
    });

    // 前へボタン
    prevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });

    // 質問を表示
    function showQuestion(questionNum) {
        // すべての質問を非表示
        for (let i = 1; i <= totalQuestions; i++) {
            document.getElementById(`question-${i}`).style.display = 'none';
        }
        
        // 現在の質問を表示
        document.getElementById(`question-${questionNum}`).style.display = 'block';
        
        // 進捗バーを更新
        const progress = (questionNum / totalQuestions) * 100;
        progressFill.style.width = progress + '%';
        
        // 質問カウンターを更新
        currentQuestionSpan.textContent = questionNum;
        
        // ボタンの表示/非表示を制御
        if (questionNum === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }
        
        if (questionNum === totalQuestions) {
            nextBtn.textContent = '診断を完了する';
        } else {
            nextBtn.textContent = '次へ →';
        }

        // スクロール位置をリセット
        window.scrollTo(0, 0);
    }

    // 結果を表示
    function showResult() {
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';

        // スコアを計算
        const score = calculateScore();
        const resultType = getResultType(score);
        const result = results[resultType];

        // 結果を表示
        document.getElementById('result-title').textContent = result.title;
        document.getElementById('result-description').textContent = result.description;
        document.getElementById('result-detail-text').textContent = result.detail;

        // スクロール位置をリセット
        window.scrollTo(0, 0);
    }

    // スコアを計算
    function calculateScore() {
        const answerArray = Object.values(answers);
        const scoreMap = { a: 0, b: 1, c: 2, d: 3 };
        
        let totalScore = 0;
        for (let answer of answerArray) {
            totalScore += scoreMap[answer] || 0;
        }
        
        return totalScore;
    }

    // 結果タイプを判定
    function getResultType(score) {
        // スコアに基づいて結果タイプを決定
        // 各質問の回答パターンから判定する方が正確
        
        // 最も多く出現した回答を見つける
        const answerArray = Object.values(answers);
        const answerCounts = {
            a: 0,
            b: 0,
            c: 0,
            d: 0
        };
        
        for (let answer of answerArray) {
            answerCounts[answer]++;
        }
        
        // 最も多い回答を見つける
        let maxCount = 0;
        let resultType = 'A';
        
        for (let type in answerCounts) {
            if (answerCounts[type] > maxCount) {
                maxCount = answerCounts[type];
                resultType = type.toUpperCase();
            }
        }
        
        return resultType;
    }
});
