import { FaPhoneAlt, FaClipboard, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Card = ({ gradient, icon: Icon, title, count, status }) => (
  <div
    className={`flex flex-col justify-between p-4 rounded-lg shadow-md ${gradient} text-white w-64 h-32`}
  >
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Icon className="text-2xl" />
    </div>
    <div className="flex justify-between items-center">
      <span className="text-3xl font-bold">{count}</span>
      <span className="text-sm">{status}</span>
    </div>
  </div>
);

const CallCards = (props) => {
  // Use the useSelector hook here
  const { piCount, pdiCount, allocatedCount, ongoingCount } = props;
  console.log("🚀 --------------------------🚀");
  console.log("🚀  CallCards  props", props);
  console.log("🚀 --------------------------🚀");

  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex gap-4">
      <Link to="/">
        <Card
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          icon={FaPhoneAlt}
          title="All Calls"
          count={
            user?.role.includes("inspector")
              ? allocatedCount + ongoingCount
              : pdiCount + piCount
          }
          status="Ongoing"
        />
      </Link>
      <Link
        to={
          user?.role.includes("inspector")
            ? `/inspector/allocated-call`
            : `/manager/pdi-call`
        }
      >
        <Card
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          icon={FaClipboard}
          title={
            user?.role.includes("inspector") ? "Allocated Call" : "PDI Calls"
          }
          count={user?.role.includes("inspector") ? allocatedCount : pdiCount}
          status="Pending"
        />
      </Link>
      <Link
        to={
          user?.role.includes("inspector")
            ? `/inspector/ongoing-call`
            : `/manager/pi-call`
        }
      >
        <Card
          gradient="bg-gradient-to-r from-indigo-500 to-blue-500"
          icon={FaCheckCircle}
          title={user?.role.includes("inspector") ? "Ongoing Call" : "PI Calls"}
          count={user?.role.includes("inspector") ? ongoingCount : piCount}
          status="Complete"
        />
      </Link>
    </div>
  );
};

export default CallCards;
