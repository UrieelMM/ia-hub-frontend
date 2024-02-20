import Markdown from "react-markdown"

interface Props {
    message: string
}

export const IAMessages = ({message}: Props) => {
  return (
    <div className="col-start-1 col-end-12 lg:col-end-10 rounded-lg">
        <div className="flex flex-row items-start">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
                <img className="rounded-lg" src="https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg" alt="Assistant Avatar" />
            </div>
            <div className="relative object-cover ml-3 text-sm bg-emerald-100 bg-opacity-25 pt-3 px-3 rounded-xl">
                <Markdown>
                    {message}
                </Markdown>
            </div>
        </div>
    </div>
  )
}