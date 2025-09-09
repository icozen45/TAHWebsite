export default function FailurePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black p-8">
      <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
      <p className="mt-4 text-lg text-center">Please try again or contact us:</p>
      <div className="mt-2 text-center pt-4">
        <h1>
            <strong className="text-2xl">+92-00000000</strong>
        </h1>
        <h1 className="text-2xl">
            <strong>example@gmail.com</strong>
        </h1>
      </div>
    </div>
  );
}
