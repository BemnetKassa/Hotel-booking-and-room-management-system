interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const color =
    status === "Vacant"
      ? "bg-green-500"
      : status === "Occupied"
      ? "bg-red-500"
      : status === "Ready for Cleaning"
      ? "bg-yellow-400 text-black"
      : "bg-blue-500";

  return (
    <span
      className={`${color} text-white px-3 py-1 text-xs font-semibold rounded-full`}
    >
      {status}
    </span>
  );
}
