interface Props {
    message: string
}

export const MyMessages = ({ message }: Props) => {
    return (
        <div className="col-start-4 col-end-12 lg:col-start-7 rounded-lg">
            <div className="flex items-center flex-row-reverse">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-300 bg-opacity-70 flex-shrink-0">
                    Tú
                </div>
                <div className="relative mr-3 text-sm bg-emerald-300 bg-opacity-70 py-1 px-2 shadow rounded-xl">
                    <div>
                        {message}
                    </div>
                </div>
            </div>
        </div>
    )
}