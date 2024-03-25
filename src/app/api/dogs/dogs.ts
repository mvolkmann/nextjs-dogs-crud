import { v4 as uuidv4 } from "uuid";

export type Dog = {
  id: string;
  name: string;
  breed: string;
};

const dogMap = new Map<string, Dog>();

addDog("Comet", "Whippet");
addDog("Oscar", "German Shorthaired Pointer");

export function addDog(name: string, breed: string): Dog {
  const id = uuidv4();
  const dog = { id, name, breed };
  dogMap.set(id, dog);
  return dog;
}

export function deleteDog(id: string): boolean {
  return dogMap.delete(id);
}

export function getDogs(): Dog[] {
  const dogs = Array.from(dogMap.values());
  return dogs.sort((a: Dog, b: Dog) => a.name.localeCompare(b.name));
}

export function updateDog(
  id: string,
  name: string,
  breed: string
): Dog | undefined {
  const dog = dogMap.get(id); // returns undefined if not found
  if (dog) {
    dog.name = name;
    dog.breed = breed;
  }
  return dog;
}
