import MainLayout from "../layouts/MainLayout";

function Teachers() {
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Teachers</h1>
          <p className="text-gray-500 mt-2">
            Manage all teachers in your school.
          </p>
        </div>

        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          + Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-10 text-center">
        <h2 className="text-2xl font-bold">
          Teacher Management Module
        </h2>

        <p className="text-gray-500 mt-3">
          We'll build the teacher table next.
        </p>
      </div>
    </MainLayout>
  );
}

export default Teachers;