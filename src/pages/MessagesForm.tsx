import {useState} from "react"
import {trpc} from "../utils/trpc"
import { useSession } from "next-auth/react";
import { waitUntilSymbol } from "next/dist/server/web/spec-extension/fetch-event";
import { util } from "zod/lib/helpers/util";

const MessagesForm = () => {
    const [isAddingMessage, setAddingMessage] = useState(false)
    const [message, setMessage] = useState("");
    const {data: session, status} = useSession()
    const utils = trpc.useContext()
    const postMessage = trpc.guestbook.postMessage.useMutation({
        onMutate: () => {
            setAddingMessage(true)
            utils.guestbook.getAll.cancel();
            const optimisticUpdate = utils.guestbook.getAll.getData()

            if(optimisticUpdate){
                utils.guestbook.getAll.setData(optimisticUpdate)
            }


        },
        onSettled: () => {
            utils.guestbook.getAll.invalidate()
            setAddingMessage(false)
        }
    });

    if(isAddingMessage){
        return <div className="flex gap-2 px-4 py-2">Thank you for adding a message!</div>
    }
  
    return (
      <form
        className="flex gap-2 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          postMessage.mutate({
            name: session?.user?.name as string,
            message,
          });
          setMessage("");
        }}
      >
        <label htmlFor="input">and also add your own, like...</label>
        <input
        autoFocus
        id="input"
          type="text"
          value={message}
          placeholder="something typed here..."
          minLength={2}
          maxLength={100}
          onChange={(event) => setMessage(event.target.value)}
          className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
        />
        <label htmlFor="btn">which can be...</label>
        <button
        id="btn"
          type="submit"
          className="p-2 rounded-md border-2  border-zinc-800 focus:outline-none"
        >
          Submitted.
        </button>
      </form>
    );
  };

  export default MessagesForm