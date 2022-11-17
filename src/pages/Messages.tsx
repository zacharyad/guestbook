import { trpc } from "../utils/trpc";

const Messages = () => {
    const {data: messages, status} = trpc.guestbook.getAll.useQuery()

    if(!status) {
        return <div>Loading Messages</div>
    }

    

    return (
        <div>
            <div className="flex flex-col gap-4 py-4 ">
            {messages?.map((msg, index) => {
                const messageTime =  msg.createdAt.toDateString()
            return (
                <div className="bg-gray-50 text-slate-600 px-2 " key={index}>
                <p>{msg.message}</p>
                <span>- {msg.name} @ {messageTime}</span>
                </div>
            );
            })}
        
        </div>
      
      </div>
    )
}

export default Messages