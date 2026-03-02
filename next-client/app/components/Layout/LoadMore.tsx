type Props = { onClick: () => void; loading: boolean };

export default function LoadMore({ onClick, loading }: Props) {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-6 py-3 bg-linear-to-r ${
          loading ? "from-gray-400 to-gray-600" : "from-blue-400 to-blue-600"
        } text-white rounded-xl hover:scale-105 transform transition shadow-md disabled:opacity-50`}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
}
