import React, { useState, useMemo } from 'react';
import Layout from './Layout.jsx';
import triviaQuestions from './triviaQuestions.js';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [questions] = useState(() => shuffle(triviaQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const progress = useMemo(
    () => Math.round((currentIndex / questions.length) * 100),
    [currentIndex, questions.length]
  );

  function handleAnswer(index) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === currentQuestion.answer) {
      setScore(s => s + 1);
    }
  }

  function nextQuestion() {
    setSelectedAnswer(null);
    setCurrentIndex(i => i + 1);
  }

  function restart() {
    setScore(0);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  return (
    <Layout>
      <div style={{ position: 'relative', zIndex: 1, height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
              🎮 טריוויה
            </h1>
            <p style={{ opacity: 0.7, marginTop: '4px', fontSize: '0.95rem' }}>
              {questions.length} שאלות • ניקוד: {score}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ height: '8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(135deg, var(--primary, #40C4C4), #2dd4bf)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>

          {isFinished ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
                {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.5 ? '🎉' : '💪'}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                הסתיים המשחק!
              </h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>
                ענית נכון על <strong>{score}</strong> מתוך <strong>{questions.length}</strong> שאלות
              </p>
              <button
                onClick={restart}
                className="btn-primary"
                style={{
                  padding: '14px 40px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                שחק שוב 🔄
              </button>
            </div>
          ) : (
            <div>
              {/* Category badge */}
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: 'var(--primary-border, rgba(64,196,196,0.2))',
                  color: 'var(--color-secondary, #2C3E50)',
                }}>
                  {currentQuestion.category}
                </span>
              </div>

              {/* Question */}
              <div className="card-info" style={{
                padding: '24px 20px',
                borderRadius: '16px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '1.3rem', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQuestion.options.map((option, i) => {
                  const isCorrect = i === currentQuestion.answer;
                  const isSelected = i === selectedAnswer;
                  let bg = 'rgba(255,255,255,0.9)';
                  let border = '1px solid rgba(0,0,0,0.08)';
                  let color = 'inherit';

                  if (selectedAnswer !== null) {
                    if (isCorrect) {
                      bg = 'rgba(34, 197, 94, 0.15)';
                      border = '2px solid #22c55e';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '2px solid #ef4444';
                    } else {
                      bg = 'rgba(255,255,255,0.5)';
                      color = 'rgba(0,0,0,0.4)';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border,
                        background: bg,
                        color,
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        cursor: selectedAnswer !== null ? 'default' : 'pointer',
                        textAlign: 'right',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{option}</span>
                      {selectedAnswer !== null && isCorrect && <span style={{ fontSize: '1.3rem' }}>✅</span>}
                      {selectedAnswer !== null && isSelected && !isCorrect && <span style={{ fontSize: '1.3rem' }}>❌</span>}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              {selectedAnswer !== null && (
                <button
                  onClick={nextQuestion}
                  className="btn-cta"
                  data-cta="true"
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {currentIndex + 1 < questions.length ? 'הבאה ←' : 'סיום 🏁'}
                </button>
              )}

              {/* Question counter */}
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', opacity: 0.5 }}>
                שאלה {currentIndex + 1} מתוך {questions.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
