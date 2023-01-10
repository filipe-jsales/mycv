import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing'; // importing the Test module from the '@nestjs/testing' package
import { AuthService } from './auth.service'; // importing the AuthService from the './auth.service' file
import { User } from './user.entity';
import { UsersService } from './users.service'; // importing the UsersService from the './users.service' file

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    const fakeUsersService: Partial<UsersService> = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);

        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // This creates a testing module that includes the AuthService and a provider for the UsersService that uses the fakeUsersService object as its value
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // This gets an instance of the AuthService from the testing module
    service = module.get(AuthService);
  });

  // This is a test that checks if an instance of the AuthService can be created
  it('can create an instance of auth service', async () => {
    // This tests that the service variable is defined
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = service.signup('asdf@asdf.com', 'asdf');

    expect((await user).password).not.toEqual('asdf');
    const [salt, hash] = (await user).password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signin('asdf@asdf.com', 'asdfg')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('asdf@asdf.com', 'mypassword');

    const user = await service.signin('asdf@asdf.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
