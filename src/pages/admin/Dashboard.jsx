import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";

function AdminDashboard() {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      if (!adminAPI?.getPendingJobs) {
        console.error("adminAPI.getPendingJobs is not defined");
        setMessage("Pending jobs API not configured");
        setPendingJobs([]);
        return;
      }

      const res = await adminAPI.getPendingJobs();
      const jobsData = res.data?.data || res.data || [];
      setPendingJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error("Failed to load pending jobs:", err);
      setMessage("Failed to load pending jobs");
      setPendingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveJob(id);
      setMessage("Job approved");
      fetchPendingJobs();
    } catch (err) {
      console.error(err);
      setMessage("Failed to approve job");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectJob(id);
      setMessage("Job rejected");
      fetchPendingJobs();
    } catch (err) {
      console.error(err);
      setMessage("Failed to reject job");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-neutral-dark mb-6">
        Admin Dashboard
      </h1>

      {message && (
        <div className="mb-4 text-sm text-green-600">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Pending Jobs</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">
            {pendingJobs.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Total Jobs</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">326</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
          <h3 className="text-neutral-medium text-sm">Employers</h3>
          <p className="text-3xl font-bold mt-2 text-brand-blue">58</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-subtle border border-neutral-light">
        <h2 className="text-xl font-semibold text-neutral-dark mb-4">
          Pending Jobs
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : pendingJobs.length === 0 ? (
          <p>No pending jobs.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-neutral-medium border-b">
                <th className="pb-3">Title</th>
                <th className="pb-3">Company</th>
                <th className="pb-3">Employer</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingJobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b hover:bg-neutral-light transition"
                >
                  <td className="py-3">{job.title}</td>
                  <td>{job.company?.companyName || "N/A"}</td>
                  <td>
                    {job.employer
                      ? `${job.employer.firstName} ${job.employer.lastName}`
                      : "N/A"}
                  </td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleApprove(job._id)}
                      className="px-3 py-1 text-sm bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(job._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
