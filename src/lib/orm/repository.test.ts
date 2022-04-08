import Column from "./columnDecorator";
import { DummyDatabaseClient } from "./databaseClient";
import Repository from "./repository";

const Text = {
  encoder: (value: string): { text: string } => ({
    text: value,
  }),
  decoder: (value: { text: string }): string => value.text,
};

const Number = {
  encoder: (value: number): { number: number } => ({
    number: value,
  }),
  decoder: (value: { number: number }): number => value.number,
};

class User {
  @Column({ type: Text })
  name: string;

  @Column({ type: Number })
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

test("", () => {
  (async () => {
    const userRepository = new Repository({
      databaseClient: new DummyDatabaseClient({}),
      targetId: "123",
      EntityModel: User,
    });

    await userRepository.save(new User("Jon", 24));
    await userRepository.save(new User("Taro", 18));

    const users = await userRepository.find();
    const usersText = users
      .map((user) => `${user.name} ${user.age}`)
      .join(", ");

    return usersText;
  })().then((data) => expect(data).toBe("Jon 24, Taro 18"));
});
