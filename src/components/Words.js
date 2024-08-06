"use client"
import { useEffect, useRef, useState } from "react"
import translations from "./translations.json"

const Words = () => {
 const [seconds,setSeconds] = useState(59)
 const [points,setPoints] = useState(0)
 const [inputWords,setInputWords] = useState("")
 const [correctWords,setCorrectWords] = useState("")
 const [scrambleWords,setScrambleWords] = useState("")
 const [message,setMessage] = useState("")
 const [start,setStart] = useState(false)
 const [modals,setModals] = useState(false)
 const [lang,setLang] = useState("tr")
 const ref = useRef()
 
 const wordsArray = translations[lang].words.toUpperCase().split(",")
 const translate = translations[lang]

 useEffect(() => {
  if(seconds <= 0){
    setModals(true)
    setMessage(translate.game)
  }
  if(start){
  const intervalId = setInterval(() => {
    setSeconds((pre) => {
      if(pre <= 1){
        clearInterval(intervalId)
        return 0;
      }
      return pre - 1;
    })
  },1000)
  return () => clearInterval(intervalId)
}
 },[seconds,translate.game,start])

useEffect(() => {
  let clearMessage;
  if(message){
    clearMessage = setTimeout(() => setMessage(""),1000)
  }
  return () => { clearTimeout(clearMessage) }
},[message])

 const handleSubmit = (e) => {
   e.preventDefault()
   if(inputWords.trim() === ""){
    ref.current.focus()
    return
  } 
  handleEnter()
 }
 
 const handleStartChange = () => {
   const word = selectWords() 
   setStart(true)
   setCorrectWords(word.toUpperCase())
   console.log(word);
   setScrambleWords(handleScrumbleWord(word)) 
  } 
  
  const handleScrumbleWord = (word) => {
    const shuffledArray = word.split("");
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Rastgele bir indeks seç
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // İki elemanı takas et
    }
    return shuffledArray.join(""); // Karıştırılmış kelimeyi birleştir
  }

  // const handleScrumbleWord = (word) => {
  //   const shuffledArray = word.split("");
  //   for (let i = shuffledArray.length - 1; i > 0; i--){
  //     const j = Math.floor(Math.random() * (i + 1));
  //      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  //   }
  //   return shuffledArray.join("")
  // }
  
 const handleLangChange = (language) => {
   setLang(language)
 }

 const handleEnter = () => {
  if(inputWords !== ""){
      ref.current.focus()

    const isCorrect = correctWords.toUpperCase() === inputWords.toUpperCase()

   if(isCorrect){
     setMessage(translate.correct)
     setSeconds(pre => pre + 15) 
     setPoints(pre => pre + 15)

     const newWord = selectWords()
     console.log(newWord);
     setCorrectWords(newWord.toUpperCase())
     setScrambleWords(handleScrumbleWord(newWord))
  

    } else{
     setMessage(translate.wrong)
     setPoints((pre) => pre - 5)
    }
 }
 setInputWords("")
}

 const handlePass = () => {
  setInputWords("")
  setMessage("")
  const newWord = selectWords()
  console.log(newWord);
  setCorrectWords(newWord)
  setScrambleWords(handleScrumbleWord(newWord))
 } 

 const handleNewGame = () => {
  setInputWords("")
  setPoints(0)
  setSeconds(59)
  setMessage("")
  const newWord = selectWords()
  console.log(newWord);
  setCorrectWords(newWord)
  setScrambleWords(handleScrumbleWord(newWord))
 }

 const selectWords = () => {
  const randomIndex = Math.floor(Math.random() * wordsArray.length)
  return wordsArray[randomIndex]
 }

 const handleOpanModal = () => {
  setModals((pre) => !pre)
  const word = selectWords() 
  setStart(true)
  setCorrectWords(word.toUpperCase())
  console.log(word);
  setScrambleWords(handleScrumbleWord(word)) 
} 

  return (
    <div className="flex justify-center items-center w-full h-screen relative overflow-hidden">
      <div className="flex h-full justify-start font-bold w-full p-10 ml-5 mt-0 gap-x-2 items-start">
          <button className="px-10 py-4 bg-slate-300 rounded-xl" onClick={() => handleLangChange("en")}>English</button>
          <button className="px-10 py-4 bg-slate-300 rounded-xl" onClick={() => handleLangChange("tr")}>Türkçe</button>
      </div>
       {message && start &&  (
         <p className="flex items-center absolute font-bold text-2xl bg-gray-300 p-5 rounded-xl justify-center h-[150px] w-[300px]">{message}</p>
       )}
    
     {!start && (<button className={`text-5xl font-bold border border-black p-5 rounded-2xl absolute  `} onClick={handleStartChange}>{translate.start}</button>)}
       
   {start && (
    <>
        <div className="w-[700px] h-[700px] border-2 border-black rounded-xl absolute flex flex-col ">
           <h2 className="text-lg border rounded-lg pl-5 ml-2 mt-2 p-2 w-44 bg-gray-300">{translate.time}: {seconds}</h2>
          <h1 className="text-4xl font-bold text-center pt-7">{translate.wordScramble}</h1>
          <div className="flex-grow flex items-end justify-center  p-5 ">

            <form onSubmit={handleSubmit} className="flex items-center">
              <p className="font-bold text-2xl absolute top-64 left-72">{inputWords}</p>
              <p className="font-bold text-2xl absolute bottom-40 left-72">{scrambleWords}</p>
              <input
                type="text"
                ref={ref}
                maxLength={correctWords.length}
                className="font-bold border border-black p-3 pl-5 px-48 rounded-xl"
                value={inputWords}
                onChange={(event) => setInputWords(event.target.value)}
              />
              <button
                className="font-bold border border-black p-3 px-16 rounded-xl ml-2"
                onClick={handleEnter}
              >
                {translate.enter}
              </button>
            </form>
          </div>
             <div className="flex">
             <button
                type="button"
                className="font-bold border border-black p-2 w-36 mb-2 rounded-xl ml-[40px] "
                onClick={handleNewGame}
              >
                {translate.newGame}
              </button>
              <button
                type="button"
                className="font-bold border border-black p-2 w-36 mb-2 rounded-xl ml-[40px] "
                onClick={handlePass}
              >
                {translate.pass}
              </button>
             </div>
        </div>
        </>
      )}
  
      {modals && start && <Modal translate={translate} handleOpanModal={handleOpanModal} points={points} />}
    
    </div>
  )
}

export default Words


const Modal = ({ translate,handleOpanModal,points }) => {

  return(
    <div className="flex justify-center h-screen w-full items-center relative">
       <div className="absolute bg-white border p-[350px] px-96 -left-[400px] flex justify-start border-black rounded-xl shadow-xl">
            <button onClick={handleOpanModal} className="border rounded-lg absolute top-2 left-2 w-36 h-16 bg-gray-300 font-bold ">{translate.modal}</button>
            <h2>{points}</h2>
       </div>
    </div>
  )
}