import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

interface SutTypes {
  sut: SendForgotPasswordEmailService;
  fakeMailProvider: FakeMailProvider;
  fakeUsersRepository: FakeUsersRepository;
}

const makeSut = (): SutTypes => {
  const fakeMailProvider = new FakeMailProvider();
  const fakeUsersRepository = new FakeUsersRepository();
  const sut = new SendForgotPasswordEmailService(
    fakeUsersRepository,
    fakeMailProvider,
  );
  return { sut, fakeMailProvider, fakeUsersRepository };
};

describe('SendForgotPasswordEmailService', () => {
  it('Should be able to revocer password using email', async () => {
    const { fakeMailProvider, fakeUsersRepository, sut } = makeSut();
    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    const userData = {
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
    };

    await fakeUsersRepository.create(userData);
    await sut.execute({
      email: 'valid@email.com',
    });

    expect(sendMailSpy).toHaveReturned();
  });

  it('Should not be able to recover a non existing user password', () => {});
});
