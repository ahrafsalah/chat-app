import { useChatStore } from '@/store/useChatStore'
import { Image, Send, X } from 'lucide-react'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

const MessageInput = () => {
  const [text, setText] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { sendMessage } = useChatStore()

  const removeImage = () => {
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setImageFile(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0]
    if (!file) {
      return;
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    setIsLoading(true)
    if (!text.trim() && !imagePreview) {
      return;
    }
    const formData = new FormData()

    if (text) {
      formData.append('text', text)
    }

    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      await sendMessage(formData);

      // Clear form
      setText("");
      removeImage();
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  }

  return (
    <div className="py-4 w-full mt-auto ">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview || isLoading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput