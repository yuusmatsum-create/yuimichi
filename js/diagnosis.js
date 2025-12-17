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
    const totalQuestions = 9;
    const answers = {};

    // 診断結果の定義（仕様書v2.0準拠）
    const results = {
        A: {
            title: '慎重に考え続けている状態',
            description: '考えを積み上げて確信を作ろうとする傾向が強いようです。',
            page: 'type-a.html'
        },
        B: {
            title: '違和感を大切にしている状態',
            description: '小さな引っかかりを見逃さない傾向が強いようです。',
            page: 'type-b.html'
        },
        C: {
            title: '頭と気持ちがずれている状態',
            description: '納得と気持ちが別に動きやすい傾向がありそうです。',
            page: 'type-c.html'
        },
        D: {
            title: '判断を保留している状態',
            description: '判断よりも、まず休息や優先順位の調整が必要そうです。',
            page: 'type-d.html'
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
        // 結果タイプを判定
        const resultType = getResultType();
        const result = results[resultType];
        
        // 結果セクションを表示
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        // 結果内容を設定
        document.getElementById('result-title').textContent = result.title;
        document.getElementById('result-description').textContent = result.description;
        document.getElementById('result-link').href = result.page;
        
        // スクロール位置をリセット
        window.scrollTo(0, 0);
    }

    // 結果タイプを判定（仕様書v2.0準拠）
    function getResultType() {
        // 各タイプのスコアを計算
        const scores = {
            a: 0,
            b: 0,
            c: 0,
            d: 0
        };
        
        // Q1-Q9の回答をカウント
        for (let i = 1; i <= totalQuestions; i++) {
            const answer = answers[`q${i}`];
            if (answer) {
                scores[answer]++;
            }
        }
        
        // 最高スコアを見つける
        let maxScore = 0;
        let maxTypes = [];
        
        for (let type in scores) {
            if (scores[type] > maxScore) {
                maxScore = scores[type];
                maxTypes = [type];
            } else if (scores[type] === maxScore) {
                maxTypes.push(type);
            }
        }
        
        // 同点の場合はQ9の回答を優先（仕様書v2.0準拠）
        let resultType;
        if (maxTypes.length > 1) {
            resultType = answers['q9'];
        } else {
            resultType = maxTypes[0];
        }
        
        // a/b/c/d を A/B/C/D に変換
        return resultType.toUpperCase();
    }
});
