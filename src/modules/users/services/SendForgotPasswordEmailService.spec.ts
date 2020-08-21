import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

interface SutTypes {
  sut: SendForgotPasswordEmailService;
  fakeMailProvider: FakeMailProvider;
  fakeUsersRepository: FakeUsersRepository;
  fakeUserTokensRepository: FakeUserTokensRepository;
}

const makeSut = (): SutTypes => {
  const fakeMailProvider = new FakeMailProvider();
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeUserTokensRepository = new FakeUserTokensRepository();
  const sut = new SendForgotPasswordEmailService(
    fakeUsersRepository,
    fakeMailProvider,
    fakeUserTokensRepository,
  );
  return {
    sut,
    fakeMailProvider,
    fakeUsersRepository,
    fakeUserTokensRepository,
  };
};

describe('SendForgotPasswordEmailService', () => {
  it('Should be able to recover password using email', async () => {
    const { fakeMailProvider, fakeUsersRepository, sut } = makeSut();
    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    const userData = {
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
    };

    await fakeUsersRepository.create(userData);
    await sut.execute({
      email: 'valid_email@mail.com',
    });

    expect(sendMailSpy).toHaveReturned();
  });

  it('Should not be able to recover a non existing user password', async () => {
    const { sut } = makeSut();

    const promise = sut.execute({
      email: 'valid@email.com',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {
    const { fakeUserTokensRepository, fakeUsersRepository, sut } = makeSut();

    const generateTokenSpy = jest.spyOn(fakeUserTokensRepository, 'generate');

    const userData = {
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
    };

    const createdUser = await fakeUsersRepository.create(userData);
    await sut.execute({
      email: 'valid_email@mail.com',
    });

    expect(generateTokenSpy).toHaveBeenCalledWith(createdUser.id);
  });
});
