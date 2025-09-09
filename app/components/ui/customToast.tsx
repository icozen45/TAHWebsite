// customToast.tsx
import toast from 'react-hot-toast';

export function showCustomToast(message = "Subscribed!", subtext = "You'll now receive updates.") {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto p-4 flex`}
    >
      <div className="flex-1 w-0">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        <p className="mt-1 text-sm text-gray-500">{subtext}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-400 hover:text-gray-500"
        >
          ✕
        </button>
      </div>
    </div>
  ));
}
