import { useState, useEffect } from "react";

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  email: string;
  phone: string;
  status: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Teacher) => void;
  teacher?: Teacher | null;
};

export default function AddTeacherModal({
  isOpen,
  onClose,
  onSave,
  teacher,
}: Props) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (teacher) {
      setName(teacher.name);
      setSubject(teacher.subject);
      setEmail(teacher.email);
      setPhone(teacher.phone);
      setStatus(teacher.status);
    } else {
      setName("");
      setSubject("");
      setEmail("");
      setPhone("");
      setStatus("Active");
    }
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !subject || !email || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    onSave({
      id: teacher ? teacher.id : Date.now(),
      name,
      subject,
      email,
      phone,
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">
          {teacher ? "Edit Teacher" : "Add Teacher"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Teacher Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {teacher ? "Save Changes" : "Add Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}