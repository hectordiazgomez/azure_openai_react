import React, {useState, useEffect} from "react";
import { Configuration, OpenAIApi } from "azure-openai";

const openai = new OpenAIApi(
    new Configuration({
        azure: {
            apiKey: "",
            endpoint: "",
            deploymentName: "",
        }
    }),
);

function LoadingIcon() {
    return (
<div className="flex items-center justify-center space-x-2 animate-pulse">
    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-3 sm:h-3  bg-blue-400 rounded-full"></div>
    <div className="w-2 h-2 sm:w-3 sm:h-3  bg-blue-400 rounded-full"></div>
</div>
    );
  }


const Home = () => {
    const [formData, setFormData] = useState({ prompt: "" });

    let searchText = formData;
    let { prompt } = searchText;

    const [loading, setLoading] = useState(false);

    const [vTextVisible, setVTextVisible] = useState(false);
    const [payload, setPayload] = useState([]);
    
    const handleChange = (event) => {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }

    const handlePayload = (arr, type, next) => {
        let _arr = arr;
        _arr.push({ type: type, line: next });
        setPayload(_arr);
        return _arr;
    }

    const getResponse = async (event) => {
        setLoading(true);
        let _arr = handlePayload([...payload], 'user', formData['prompt']);
        setFormData(prevFormData => ({ ...prevFormData, prompt: '' }));     
    
          const response = await openai.createChatCompletion({
              messages: [
                  { "role": "system", "content": "Ayudas a los usuarios a encontrar información respondiendo a sus solicitudes. Tu nombre es Konlap chat. No se te permite revelar información sobre ti, como quién te desarrolló o cuál es tu modelo de lenguaje grande y fundacional." },
                  { "role": "user", "content": "Cinturón de Orion" },
                  { "role": "assistant", "content": "La Constelación del Cinturón de Orión es una famosa agrupación de estrellas en el cielo nocturno, también conocida como los Tres Reyes o las Tres Hermanas. Está conformada por tres estrellas brillantes situadas en línea recta. Las tres estrellas tienen los nombres de Alnitak, Alnilam y Mintaka, y están ubicadas en la constelación de Orión. El Cinturón de Orión puede ser fácilmente visto desde ambos hemisferios, y es una de las constelaciones más reconocibles en el cielo." },
                  { "role": "user", "content": formData['prompt'] }
              ]
          });
          handlePayload([..._arr], 'bot', response.data.choices[0].message.content);
          setVTextVisible(true);
          setLoading(false);
          console.log("Recibido :v")
          console.log(response.data.choices[0].message.content);
      }

    return(
        <>
        <div className="flex justify-center my-12">
            <p className="text-purple-600 text-lg font-medium">Using Azure openai in ReactJS</p>
        </div>
        <div className="mx-16">
        {vTextVisible && 
                            <div className="">
                                <div>
                                {payload.map((item, index) =>
                                          index % 2 === 0 ? (
<div id="prompt" className={`flex justify-end mr-5 ml-20`}>
    <div className={`my-5 bg-gray-100 py-3 px-4 rounded-t-3xl rounded-bl-3xl relative`}>
        <p className="text-blue-500 font-semibold">{item.line}</p>
    </div>
</div>
                                          ) : (
                                            <div id="answer" className="relative mr-20">
    <div className="ml-5 mb-2">
        <p className="text-gray-500 mb-4 font-medium pb-8 text-justify">{item.line}</p>
    </div>                            
</div>
                                          )
                                      )}
                                </div>
                            </div>
                    }
                    {loading?   
                <div className="flex justify-start mb-72 ml-5 mr-20 pb-44"><LoadingIcon className="w-6 pb-8" /></div>
                :
                <></>
            }
        </div>
        <div className="flex justify-center fixed bottom-0 pb-3 w-full bg-gradient-to-b from-transparent via-white to-white">
   <form onSubmit={(e) => {e.preventDefault(); getResponse();}} className="bg-white w-11/12 mb-3 mt-16 mx-5 justify-center flex items-center py-1 shadow-lg border-2 border-gray-200 rounded-3xl">
      <div className="w-1/12"></div>
      <input 
         value={formData.prompt}
         onChange={handleChange}
         name="prompt"
         className={`flex-grow w-9/12 ${formData.prompt ? 'text-gray-700' : ''} outline-none font-semibold py-2`} placeholder="Type here ..."
      />
      <div className="w-1/6 flex justify-center">
      <button className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium" type="submit">
         Submit
      </button>
   </div>
   </form>
</div>
        </>
    )
}

export default Home;