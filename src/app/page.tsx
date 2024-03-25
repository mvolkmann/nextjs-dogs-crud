"use client";
import { useEffect, useState } from "react";

type Dog = { id: string; name: string; breed: string };

const Home = () => {
  const [dogMap, setDogMap] = useState<Map<string, Dog>>(new Map());
  const [selectedDog, setSelectedDog] = useState<Dog | undefined>();

  useEffect(() => {
    loadDogs();
  }, []);

  function addDog(dog: Dog) {
    const newDogMap = new Map(dogMap);
    newDogMap.set(dog.id, dog);
    setDogMap(newDogMap);
  }

  function deleteDog(id: string) {
    const newDogMap = new Map(dogMap);
    newDogMap.delete(id);
    setDogMap(newDogMap);
  }

  async function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
    if (!confirm("Are you sure?")) return;

    const tr = event.currentTarget.closest("tr");
    // It should never fail to find a `tr` that wraps the clicked button.
    if (!tr) throw new Error("tr not found");

    try {
      const res = await fetch(`/api/dogs/${tr.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("DELETE failed");
      deleteDog(tr.id);
    } catch (error) {
      console.error("Error deleting dog:", error);
    }
  }

  function handleEdit(event: React.MouseEvent<HTMLButtonElement>) {
    const tr = event.currentTarget.closest("tr");
    // It should never fail to find a `tr` that wraps the clicked button.
    if (!tr) throw new Error("tr not found");

    // This causes the name and breed of the selected dog
    // to appear in the form at the top.
    setSelectedDog(dogMap.get(tr.id));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const url = selectedDog ? `/api/dogs/${selectedDog.id}` : "/api/dogs";
    try {
      const res = await fetch(url, {
        method: selectedDog ? "PUT" : "POST",
        body: new FormData(form),
      });
      if (!res.ok) throw new Error("POST failed");
      form.reset(); // clears the form inputs
      const newDog = await res.json();
      addDog(newDog);
      setSelectedDog(undefined);
    } catch (error) {
      console.error("POST failed:", error);
    }
  }

  // Called when the page is loaded.
  async function loadDogs() {
    const res = await fetch("/api/dogs");
    const dogArray = await res.json();
    const dogMap = new Map<string, Dog>();
    for (const dog of dogArray) {
      dogMap.set(dog.id, dog);
    }
    setDogMap(dogMap);
  }

  return (
    <main>
      <h1>Dogs</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            size={30}
            type="text"
            defaultValue={selectedDog ? selectedDog.name : ""}
          />
        </div>
        <div>
          <label htmlFor="breed">Breed</label>
          <input
            id="breed"
            name="breed"
            required
            size={30}
            type="text"
            defaultValue={selectedDog ? selectedDog.breed : ""}
          />
        </div>
        <div className="buttons">
          <button id="submit-btn">{selectedDog ? "Update" : "Add"}</button>
          {selectedDog && (
            <button type="button" onClick={() => setSelectedDog(undefined)}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Breed</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(dogMap.values()).map((dog) => (
            <tr className="on-hover" id={dog.id} key={dog.id}>
              <td>{dog.name}</td>
              <td>{dog.breed}</td>
              <td className="buttons">
                <button
                  className="show-on-hover"
                  onClick={handleDelete}
                  type="button"
                >
                  ✕
                </button>
                {/* This selects the dog which triggers a selection-change event
            which causes the form to update. */}
                <button
                  className="show-on-hover"
                  onClick={handleEdit}
                  type="button"
                >
                  ✎
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Home;
