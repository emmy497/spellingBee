import { useEffect } from "react";


function PredictLearningPace() {
   useEffect(() => {
   printPace()
   }, [])
   

    const printPace = async () => {
        const res = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      average_response_time: 2.4,
      error_rate: 0.15,
      retries_per_word: 1.1
    })
  });

  const data = await res.json();
  console.log(data)
  console.log("Predicted Learning Pace:", data.prediction);
    }
  return (
    <div>
        
    </div>
  )
}

export default PredictLearningPace