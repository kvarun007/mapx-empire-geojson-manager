import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EmpireForm from "./components/EmpireForm";
import EmpireList from "./components/EmpireList";

function App() {
	const handleFormSubmit = async (data) => {
		console.log("Form submitted with:", data);
		try {
			const response = await fetch(
				"http://localhost:5000/geo-json-service/upload",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);

			const result = await response.json();
			console.log("Server response:", result);
			alert(result.status);
		} catch (error) {
			console.error("Error uploading empire:", error);
		}
	};

	const [selectedEmpire, setSelectedEmpire] = useState(null);

	return (
		<>
			<div className=" mx-auto  w-full">
				<h1 className="text-3xl font-bold text-center mb-8">
					🌍 Empire GeoJSON Manager
				</h1>
				{/* Upload Form */}
				<div className="mb-10 border border-gray-200 rounded-lg p-6 shadow">
					<EmpireForm
						onSubmit={handleFormSubmit}
						initialData={selectedEmpire}
						isEditing={Boolean(selectedEmpire)}
					/>
				</div>
				View Table
				<div className="border border-gray-200 rounded-lg p-6 shadow w-full">
					<EmpireList onSelect={setSelectedEmpire} />
				</div>
			</div>
		</>
	);
}

export default App;
