import { ChatType, Role } from '@/db/chats'
import { Bot } from 'lucide-react'

function Message({ role, type = 'chat', content }: { role: Role, type?: ChatType, content: string }) {
  return (
    <div className="flex w-full gap-4">
      { role === 'system' && <Bot className="size-6" /> }
      <div className='text-sm leading-6 flex-1'>
        {
          role === 'system' ? 
          <div className="">
            {type}{content}
          </div> :
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg float-right">
            {content}
          </div>
        }
      </div>
    </div>
  )
}

export default function Chat() {
  return <div className="flex-1 w-full flex flex-col p-4 gap-6">
    <Message role='system' content={`Here are some of the recent pull requests in the microsoft/vscode repository:
      Add character speed and attack

      Author: faraon-bot
      Created At: 2024-12-31T07:02:27Z
      State: Open
      Description: Add character class with speed and attack properties and methods to increase them.
      Fix max call stack error when closing large outline

      Author: faraon-bot
      Created At: 2024-12-31T06:54:02Z
      State: Open
      Description: Related to #235889`} 
    />
    <Message role='user' content='Retrieve pull requests in microsoft/vscode.' />
    <Message role='system' content={`Here are some of the recent pull requests in the microsoft/vscode repository:
      Add character speed and attack

      Author: faraon-bot
      Created At: 2024-12-31T07:02:27Z
      State: Open
      Description: Add character class with speed and attack properties and methods to increase them.
      Fix max call stack error when closing large outline

      Author: faraon-bot
      Created At: 2024-12-31T06:54:02Z
      State: Open
      Description: Related to #235889`} 
    />
  </div>
}