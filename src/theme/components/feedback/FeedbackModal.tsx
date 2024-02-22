
import { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from 'sonner';

interface Props{
    handleShowModalFeedback: () => void;
}

export const FeedbackModal = (
    {handleShowModalFeedback}: Props
) => {
  const [ message, setMessage ] = useState( "" );

  const handleSend = ( e: any ) => {
    e.preventDefault();

    if (!message.trim() ) {
      toast.info( 'Por favor, compártenos tus comentarios' );
      return;
    }

    emailjs
      .sendForm(
        "my_gmail_service",
        "urieeldev_template",
        e.target,
        "user_VGe2axNgQKXlEzuYyPuBl"
      )
      .then(
        ( result ) => {
          console.log( result.text );
        },
        ( error ) => {
          console.log( error.text );
        }
      );
      setMessage( "" );
      handleShowModalFeedback();
    toast.success( '¡Gracias! Hemos recibido tus comentarios' );

  };

  return (
    <div className="absolute h-auto bottom-32 w-[85vw] md:w-[450px]  bg-gray-50 z-50 left-[45%] rounded-xl border-gray-400 shadow-xl px-2 py-4">
        <header>
            <p className="text-md font-medium  text-center">
                ¿Cómo ha sido tu experiencia?
            </p>
        </header>
        <div>
            <form onSubmit={handleSend}>
                <div className="flex justify-center space-x-4">
                    <label></label>
                    <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} className=" focus:border-emerald-100 outline-none w-full  h-44 border-2 p-2 border-emerald-50 rounded-xl" placeholder="Compártenos tus comentarios"></textarea>
                </div>
                <div className="flex justify-center mt-4">
                    <button type="button" onClick={handleShowModalFeedback} className="w-24 h-8 bg-gray-400 text-white rounded-md">Cancelar</button>
                    <button type="submit" className="w-24 h-8 ml-1 bg-emerald-500 text-white rounded-md">Enviar</button>
                </div>
            </form>
        </div>
    </div>
  )
}
