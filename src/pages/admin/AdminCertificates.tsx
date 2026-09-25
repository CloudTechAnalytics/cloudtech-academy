import { useState } from "react";
import { Link } from "react-router";
import { getBackend } from "@/lib/backend";
import { PageLoading } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { Alert, TextField } from "@/components/Form";
import { AdminHeading } from "./AdminLayout";
import { useAdminData } from "./useAdmin";

export default function AdminCertificates() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, error, reload } = useAdminData(async () => (await getBackend()).admin.listCertificates(search), [search]);
  const [msg, setMsg] = useState<string | null>(null);

  const revoke = async (id: string, credentialId: string) => {
    const reason = window.prompt(`Why is ${credentialId} being revoked? The reason is shown to the learner.`);
    if (!reason?.trim()) return;
    try {
      await (await getBackend()).admin.revokeCertificate(id, reason.trim());
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't revoke the certificate.");
    }
  };

  if (error) return <Alert tone="error">{error}</Alert>;

  return (
    <>
      <AdminHeading title="Certificates" />
      <form
        className="mb-5 flex max-w-lg items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q);
        }}
      >
        <div className="flex-1">
          <TextField label="Search by name or credential ID" type="search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button type="submit" className="mb-0.5 rounded-lg border border-line-strong px-4 py-2.5 text-[0.9375rem] font-semibold hover:border-ink/40">
          Search
        </button>
      </form>
      {msg && (
        <div className="mb-4">
          <Alert tone="error">{msg}</Alert>
        </div>
      )}
      {!data ? (
        <PageLoading />
      ) : data.length === 0 ? (
        <p className="text-muted">{search ? "No certificates match that search." : "No certificates have been issued yet."}</p>
      ) : (
        <div className="table-scroll rounded-2xl border border-line bg-paper">
          <table>
            <thead>
              <tr>
                <th>Credential ID</th>
                <th>Recipient</th>
                <th>Course</th>
                <th>Issued</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id}>
                  <td className="whitespace-nowrap font-mono text-[0.8125rem]">
                    <Link to={`/verify/${c.credentialId}`} className="hover:text-brass-dark">
                      {c.credentialId}
                    </Link>
                  </td>
                  <td>{c.recipientName}</td>
                  <td>{c.courseTitle}</td>
                  <td className="whitespace-nowrap">{formatDate(c.issuedAt)}</td>
                  <td>{c.status === "valid" ? "Valid" : <span className="text-danger" title={c.revokedReason ?? undefined}>Revoked</span>}</td>
                  <td className="text-right">
                    {c.status === "valid" && (
                      <button type="button" onClick={() => void revoke(c.id, c.credentialId)} className="text-[0.8125rem] font-semibold text-danger">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
