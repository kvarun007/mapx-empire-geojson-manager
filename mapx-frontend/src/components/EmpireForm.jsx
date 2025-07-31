import React, { useState, useEffect } from "react";

function EmpireForm({ onSubmit, isEditing = false, initialData }) {
	// States
	const [empireName, setEmpireName] = useState("");
	const [startYear, setStartYear] = useState("");
	const [endYear, setEndYear] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState("");

	// ✅ Sync form values when editing is triggered
	useEffect(() => {
		if (isEditing && initialData) {
			setEmpireName(initialData.empire_name || "");
			setStartYear(initialData.start_year || "");
			setEndYear(initialData.end_year || "");
			setContent(
				initialData.content ? JSON.stringify(initialData.content, null, 2) : ""
			);
		}
	}, [initialData, isEditing]);

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		if (name === "empire_name") {
			setEmpireName(value);
		} else if (name === "start_year") {
			setStartYear(value);
		} else if (name === "end_year") {
			setEndYear(value);
		} else if (name === "content") {
			setContent(value);
		}
	};

	// Handle file upload
	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = function (event) {
			setContent(event.target.result);
		};
		reader.readAsText(file);
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!empireName || !startYear || !endYear || !content) {
			setError("Please fill in all fields");
			return;
		}

		setError("");

		let parsedContent;
		try {
			parsedContent = JSON.parse(content);
		} catch (err) {
			setError("Invalid GeoJSON content. Please ensure it's valid JSON.");
			return;
		}

		const formData = {
			empire_name: empireName,
			start_year: parseInt(startYear),
			end_year: parseInt(endYear),
			content: parsedContent,
		};

		try {
			console.log(formData);
			if (isEditing && initialData?.object_id) {
				const res = await fetch(
					"http://localhost:5000/geo-json-service/update",
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },

						body: JSON.stringify({
							...formData,
							object_id: initialData.object_id,
						}),
					}
				);

				const result = await res.json();
				alert(result.status || "Empire updated successfully!");
			} else {
				onSubmit(formData);
			}

			// Reset form
			setEmpireName("");
			setStartYear("");
			setEndYear("");
			setContent("");
		} catch (err) {
			console.error("Submission error:", err);
			setError("Error submitting form. Please check console.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl mx-auto"
		>
			<h2 className="text-xl font-semibold">
				{isEditing ? "Update Empire" : "Upload New Empire"}
			</h2>

			{error && <p className="text-red-600 text-sm">{error}</p>}

			<div>
				<label className="block text-sm font-medium">Empire Name</label>
				<input
					type="text"
					name="empire_name"
					value={empireName}
					onChange={handleInputChange}
					className="w-full mt-1 border border-gray-300 rounded p-2"
					required
				/>
			</div>

			<div className="flex gap-4">
				<div className="w-1/2">
					<label className="block text-sm font-medium">Start Year</label>
					<input
						type="number"
						name="start_year"
						value={startYear}
						onChange={handleInputChange}
						className="w-full mt-1 border border-gray-300 rounded p-2"
						required
					/>
				</div>
				<div className="w-1/2">
					<label className="block text-sm font-medium">End Year</label>
					<input
						type="number"
						name="end_year"
						value={endYear}
						onChange={handleInputChange}
						className="w-full mt-1 border border-gray-300 rounded p-2"
						required
					/>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium">GeoJSON Content</label>
				<textarea
					name="content"
					value={content}
					onChange={handleInputChange}
					rows="5"
					placeholder="Paste raw GeoJSON content here..."
					className="w-full mt-1 border border-gray-300 rounded p-2 font-mono text-sm"
				/>
				<input
					type="file"
					accept=".json,.geojson"
					onChange={handleFileUpload}
					className="mt-2"
				/>
			</div>

			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
				{isEditing ? "Update" : "Upload"}
			</button>
		</form>
	);
}

export default EmpireForm;
