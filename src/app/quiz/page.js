'use client'
import { useState, useEffect } from 'react';

export default function GrammarResource() {
  const [activeSection, setActiveSection] = useState('june2024');
  const [activeTab, setActiveTab] = useState('sentenceTypes');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // June 2024 Data
  const june2024 = {
    sentenceTypes: [
      {
        id: 1,
        sentence: "Let's walk together.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Imperative",
        explanation: "Suggests an action or command using 'let's'."
      },
      {
        id: 2,
        sentence: "What can one person do?",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Interrogative",
        explanation: "Asks a question; ends with a question mark."
      },
      {
        id: 3,
        sentence: "We have made progress.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Declarative",
        explanation: "States a fact or information."
      },
      {
        id: 4,
        sentence: "How utterly we have failed our children!",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Exclamatory",
        explanation: "Expresses a strong emotion with 'How utterly...!'"
      },
      {
        id: 5,
        sentence: "What a big challenge it is!",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Exclamatory",
        explanation: "Begins with 'What a...!'; expresses surprise/emotion."
      },
      {
        id: 6,
        sentence: "Kill not your children because of poverty.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Imperative",
        explanation: "A negative command in formal/poetic tone."
      },
      {
        id: 7,
        sentence: "Do you know your multiplication tables?",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Interrogative",
        explanation: "Begins with 'Do...'; asks a question."
      }
    ],
    fillInBlanks: [
      {
        id: 8,
        sentence: "The box of chocolates ___ left on the kitchen counter.",
        options: ["was", "were"],
        correctAnswer: "was",
        explanation: "'Box' is singular; prepositional phrase 'of chocolates' does not affect the verb."
      },
      {
        id: 9,
        sentence: "We went to ___ concert last night.",
        options: ["a", "an", "the"],
        correctAnswer: "a",
        explanation: "'Concert' starts with a consonant sound, so we use 'a'."
      },
      {
        id: 10,
        sentence: "Mathematics ___ not my favorite subject in school.",
        options: ["is", "are"],
        correctAnswer: "is",
        explanation: "Though it ends in '-s', 'Mathematics' is a singular noun."
      },
      {
        id: 11,
        sentence: "The team ___ practicing hard for the upcoming match.",
        options: ["is", "are"],
        correctAnswer: "is",
        explanation: "'Team' is a collective noun; takes a singular verb here."
      },
      {
        id: 12,
        sentence: "Nobody ___ the trouble I've seen.",
        options: ["know", "knows"],
        correctAnswer: "knows",
        explanation: "'Nobody' is singular, so the verb must be 'knows'."
      },
      {
        id: 13,
        sentence: "The committee ___ these questions carefully.",
        options: ["debate", "debates"],
        correctAnswer: "debates",
        explanation: "'Committee' is a singular collective noun."
      },
      {
        id: 14,
        sentence: "The scientist looked ___ the microscope.",
        options: ["through", "in", "at"],
        correctAnswer: "through",
        explanation: "'Through' is the correct preposition for viewing via a lens."
      }
    ]
  };

  // December 2023 Data
  const december2023 = {
    voiceSpeech: [
      {
        id: 15,
        sentence: "Nishkarsh is playing football.",
        answer: "Football is being played by Nishkarsh.",
        explanation: "Present continuous passive voice."
      },
      {
        id: 16,
        sentence: "He said, 'His horse died in the night.'",
        answer: "He said that his horse had died in the night.",
        explanation: "Indirect past perfect (from simple past)."
      },
      {
        id: 17,
        sentence: "She said, 'Oh no! I missed the train.'",
        answer: "She exclaimed with regret that she had missed the train.",
        explanation: "Exclamatory + past perfect."
      },
      {
        id: 18,
        sentence: "They were doing good work.",
        answer: "Good work was being done by them.",
        explanation: "Past continuous passive."
      },
      {
        id: 19,
        sentence: "Sam has written a letter.",
        answer: "A letter has been written by Sam.",
        explanation: "Present perfect passive."
      },
      {
        id: 20,
        sentence: "He said, 'I have lost my mobile phone.'",
        answer: "He said that he had lost his mobile phone.",
        explanation: "Present perfect → past perfect in indirect speech."
      },
      {
        id: 21,
        sentence: "'Why haven't you phoned me?' he asked me.",
        answer: "He asked me why I hadn't phoned him.",
        explanation: "Question in past perfect."
      }
    ],
    subjectVerb: [
      {
        id: 22,
        sentence: "Mathematics ___ John's favorite subject, while Civics ___ Andrea's favorite subject.",
        options: ["is, is", "are, are", "is, are", "are, is"],
        correctAnswer: "is, is",
        explanation: "Both are singular academic subjects."
      },
      {
        id: 23,
        sentence: "Eight dollars ___ the price of a movie these days.",
        options: ["is", "are"],
        correctAnswer: "is",
        explanation: "Amount of money is singular."
      },
      {
        id: 24,
        sentence: "___ the tweezers in this drawer?",
        options: ["Is", "Are"],
        correctAnswer: "Are",
        explanation: "'Tweezers' is plural in form."
      },
      {
        id: 25,
        sentence: "Your pants ___ at the cleaner's.",
        options: ["is", "are"],
        correctAnswer: "are",
        explanation: "'Pants' is always plural."
      },
      {
        id: 26,
        sentence: "There ___ fifteen candies... Now there ___ only one left.",
        options: ["were, is", "was, is", "were, are", "was, are"],
        correctAnswer: "were, is",
        explanation: "'Were' for plural candies; 'is' for one."
      },
      {
        id: 27,
        sentence: "The committee ___ these questions carefully.",
        options: ["debate", "debates"],
        correctAnswer: "debates",
        explanation: "Singular collective noun."
      },
      {
        id: 28,
        sentence: "Either my shoes or your coat ___ always on the floor.",
        options: ["is", "are"],
        correctAnswer: "is",
        explanation: "Closest subject is 'coat' (singular)."
      }
    ]
  };

  // June 2023 Data
  const june2023 = {
    sentenceTypes: [
      {
        id: 29,
        sentence: "Pass the ball.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Imperative",
        explanation: "A direct command."
      },
      {
        id: 30,
        sentence: "Should I call or email you?",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Interrogative",
        explanation: "Asks a question."
      },
      {
        id: 31,
        sentence: "I have been visiting this temple since 2005.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Declarative",
        explanation: "Gives information."
      },
      {
        id: 32,
        sentence: "What a great car you have!",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Exclamatory",
        explanation: "Expresses strong emotion."
      },
      {
        id: 33,
        sentence: "Janet went to the library to borrow some books.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Declarative",
        explanation: "Statement of fact."
      },
      {
        id: 34,
        sentence: "The water was so cold that we could not swim in it.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Declarative",
        explanation: "Statement of condition."
      },
      {
        id: 35,
        sentence: "The little girl started crying when she couldn't find her toy.",
        options: ["Imperative", "Interrogative", "Declarative", "Exclamatory"],
        correctAnswer: "Declarative",
        explanation: "Gives information."
      }
    ],
    fillInBlanks: [
      {
        id: 36,
        sentence: "I borrowed ___ pencil from your pile...",
        options: ["a", "an", "the"],
        correctAnswer: "a",
        explanation: "'Pencil' starts with consonant sound."
      },
      {
        id: 37,
        sentence: "One of the students said, '___ professor is late today.'",
        options: ["A", "An", "The"],
        correctAnswer: "The",
        explanation: "Refers to a specific professor."
      },
      {
        id: 38,
        sentence: "The educator told Paul that if he did not finish his project, she would call his mother.",
        answer: "Conditional indirect speech.",
        explanation: "Correct as is."
      },
      {
        id: 39,
        sentence: "They ___ on this project...",
        options: ["are working", "is working", "work"],
        correctAnswer: "are working",
        explanation: "Present continuous tense."
      },
      {
        id: 40,
        sentence: "Tom stood before her ___ the queue.",
        options: ["in", "on", "at"],
        correctAnswer: "in",
        explanation: "'In the queue' is the correct phrase."
      },
      {
        id: 41,
        sentence: "Could you help me, please? → ___",
        answer: "Could I be helped, please?",
        explanation: "Passive voice with modal."
      },
      {
        id: 42,
        sentence: "Who can answer my question? → ___",
        answer: "By whom can my question be answered?",
        explanation: "Passive form of 'Who can answer...'"
      }
    ],
    wordFormation: [
      {
        id: 43,
        sentence: "He was acting in a very ___ way. (child)",
        answer: "childish",
        explanation: "'-ish' added to child."
      },
      {
        id: 44,
        sentence: "She looked ___. (hope)",
        answer: "hopeless",
        explanation: "'-less' shows lack of hope."
      },
      {
        id: 45,
        sentence: "He wants to be a ___. (music)",
        answer: "musician",
        explanation: "'-ian' as profession."
      },
      {
        id: 46,
        sentence: "...win the ___. (champion)",
        answer: "championship",
        explanation: "'-ship' for a competition."
      },
      {
        id: 47,
        sentence: "...only a ___ of people... (hand)",
        answer: "handful",
        explanation: "'-ful' indicates quantity."
      },
      {
        id: 48,
        sentence: "He was ___ for the second time. (success)",
        answer: "unsuccessful",
        explanation: "'un-' negates 'successful'."
      },
      {
        id: 49,
        sentence: "I think that you should ___ your decision. (consider)",
        answer: "reconsider",
        explanation: "'re-' prefix means again."
      }
    ]
  };

  // November 2022 Data
  const november2022 = [
    {
      id: 50,
      sentence: "She asked whether we would come for the party.",
      answer: "'Will you come for the party?' she asked.",
      explanation: "Changed to direct question."
    },
    {
      id: 51,
      sentence: "Logistics ___ not my area of expertise.",
      options: ["is", "are"],
      correctAnswer: "is",
      explanation: "'Logistics' is a singular noun."
    },
    {
      id: 52,
      sentence: "The recipe required flour, sugar, eggs, and cream.",
      answer: "Correct as is (commas and Oxford comma added for clarity).",
      explanation: "Proper comma usage."
    },
    {
      id: 53,
      sentence: "The train went ___ a tunnel.",
      options: ["through", "in", "at"],
      correctAnswer: "through",
      explanation: "Correct preposition."
    },
    {
      id: 54,
      sentence: "He completed ___ internship...",
      options: ["a", "an"],
      correctAnswer: "an",
      explanation: "'Internship' starts with a vowel sound."
    },
    {
      id: 55,
      sentence: "The problem could be solved by him.",
      answer: "Correct passive form.",
      explanation: "Proper passive construction."
    },
    {
      id: 56,
      sentence: "I ___ a loud noise.",
      options: ["heard", "was hearing"],
      correctAnswer: "heard",
      explanation: "'Was hearing' is incorrect; use simple past 'heard'."
    }
  ];

  const getCurrentData = () => {
    switch (activeSection) {
      case 'june2024':
        return june2024[activeTab] || [];
      case 'december2023':
        return december2023[activeTab] || [];
      case 'june2023':
        return june2023[activeTab] || [];
      case 'november2022':
        return november2022;
      default:
        return [];
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    const questions = getCurrentData();
    let correct = 0;
    
    questions.forEach(question => {
      if (question.options && selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    setScore(Math.round((correct / questions.filter(q => q.options).length) * 100));

    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getQuestionCardClass = (questionId) => {
    if (!showResults) return "border-gray-200";
    
    const question = getCurrentData().find(q => q.id === questionId);
    if (!question.options) return "border-gray-200";
    
    const isCorrect = selectedAnswers[questionId] === question.correctAnswer;
    return isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";
  };

  const renderSectionTabs = () => {
    return (
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          onClick={() => { setActiveSection('june2024'); setActiveTab('sentenceTypes'); resetQuiz(); }}
          className={`px-4 py-3 font-medium text-sm flex-grow text-center ${activeSection === 'june2024' ? 'bg-[#00b4d8] text-white' : 'bg-[#caf0f8] text-[#03045e]'}`}
        >
          June 2024
        </button>
        <button
          onClick={() => { setActiveSection('december2023'); setActiveTab('voiceSpeech'); resetQuiz(); }}
          className={`px-4 py-3 font-medium text-sm flex-grow text-center ${activeSection === 'december2023' ? 'bg-[#00b4d8] text-white' : 'bg-[#caf0f8] text-[#03045e]'}`}
        >
          Dec 2023
        </button>
        <button
          onClick={() => { setActiveSection('june2023'); setActiveTab('sentenceTypes'); resetQuiz(); }}
          className={`px-4 py-3 font-medium text-sm flex-grow text-center ${activeSection === 'june2023' ? 'bg-[#00b4d8] text-white' : 'bg-[#caf0f8] text-[#03045e]'}`}
        >
          June 2023
        </button>
        <button
          onClick={() => { setActiveSection('november2022'); setActiveTab(''); resetQuiz(); }}
          className={`px-4 py-3 font-medium text-sm flex-grow text-center ${activeSection === 'november2022' ? 'bg-[#00b4d8] text-white' : 'bg-[#caf0f8] text-[#03045e]'}`}
        >
          Nov 2022
        </button>
      </div>
    );
  };

  const renderSubTabs = () => {
    if (activeSection === 'june2024') {
      return (
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('sentenceTypes'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'sentenceTypes' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Sentence Types
          </button>
          <button
            onClick={() => { setActiveTab('fillInBlanks'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'fillInBlanks' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Fill in Blanks
          </button>
        </div>
      );
    } else if (activeSection === 'december2023') {
      return (
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('voiceSpeech'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'voiceSpeech' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Voice/Speech
          </button>
          <button
            onClick={() => { setActiveTab('subjectVerb'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'subjectVerb' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Subject-Verb
          </button>
        </div>
      );
    } else if (activeSection === 'june2023') {
      return (
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('sentenceTypes'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'sentenceTypes' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Sentence Types
          </button>
          <button
            onClick={() => { setActiveTab('fillInBlanks'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'fillInBlanks' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Fill in Blanks
          </button>
          <button
            onClick={() => { setActiveTab('wordFormation'); resetQuiz(); }}
            className={`px-4 py-2 font-medium text-xs flex-grow text-center ${activeTab === 'wordFormation' ? 'bg-[#0077b6] text-white' : 'bg-[#90e0ef] text-[#03045e]'}`}
          >
            Word Formation
          </button>
        </div>
      );
    }
    return null;
  };

  const renderQuestions = () => {
    const data = getCurrentData();
    
    if (activeSection === 'november2022') {
      return (
        <div className="grid gap-6">
          {november2022.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-5">
              <p className="text-lg font-medium text-[#03045e] mb-2">{item.sentence}</p>
              {item.options ? (
                <>
                  <div className="mb-3">
                    <span className="font-semibold">Correct answer:</span> 
                    <span className="ml-2 text-green-600">{item.correctAnswer}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{item.explanation}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <span className="font-semibold">Answer:</span> 
                    <span className="ml-2 text-green-600">{item.answer}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{item.explanation}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (!showResults) {
      return (
        <>
          <div className="grid gap-6">
            {data.map((question) => (
              <div 
                key={question.id} 
                className={`border rounded-lg p-5 transition-all duration-300 ${getQuestionCardClass(question.id)}`}
              >
                <p className="text-lg font-medium text-[#03045e] mb-4">{question.sentence}</p>
                {question.options ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(question.id, option)}
                        className={`py-2 px-4 rounded-md text-left transition-all ${selectedAnswers[question.id] === option 
                          ? 'bg-[#0077b6] text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {data.some(q => q.options) && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={calculateScore}
                disabled={Object.keys(selectedAnswers).length !== data.filter(q => q.options).length}
                className={`py-3 px-8 rounded-full font-bold text-white ${Object.keys(selectedAnswers).length === data.filter(q => q.options).length 
                  ? 'bg-[#00b4d8] hover:bg-[#0096c7] transform hover:scale-105 transition-transform' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Submit Answers
              </button>
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#00b4d8] text-white text-2xl font-bold mb-4">
              {score}%
            </div>
            <h2 className="text-2xl font-bold text-[#03045e]">
              {score >= 80 ? 'Excellent Work!' : score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600 mt-2">
              You scored {score}% on this quiz
            </p>
          </div>
          
          <div className="grid gap-6 mb-8">
            {data.map((question) => (
              <div 
                key={question.id} 
                className={`border rounded-lg p-5 ${getQuestionCardClass(question.id)}`}
              >
                <p className="text-lg font-medium text-[#03045e] mb-2">{question.sentence}</p>
                
                {question.options ? (
                  <>
                    <div className="mb-3">
                      <span className="font-semibold">Your answer:</span> 
                      <span className={`ml-2 ${selectedAnswers[question.id] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedAnswers[question.id] || 'Not answered'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="font-semibold">Correct answer:</span> 
                      <span className="ml-2 text-green-600">{question.correctAnswer}</span>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <span className="font-semibold">Explanation:</span> 
                    <span className="ml-2 text-gray-700">{question.explanation}</span>
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={resetQuiz}
              className="py-3 px-8 rounded-full font-bold bg-[#03045e] text-white hover:bg-[#02033a] transform hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03045e] to-[#0077b6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#03045e] p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Grammar Examination Resource</h1>
            <p className="text-center mt-2 text-[#90e0ef]">June 2024, December 2023, June 2023, and November 2022 Examinations</p>
          </div>
          
          {/* Section Tabs */}
          {renderSectionTabs()}
          
          {/* Sub Tabs */}
          {renderSubTabs()}
          
          {/* Content */}
          <div className="p-6">
            {renderQuestions()}
          </div>
        </div>
        
        <div className="mt-6 text-center text-white text-sm">
          <p>© {new Date().getFullYear()} Grammar Examination Resource | Designed with Next.js & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}