import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmailService', () => {
  it('Should be able to revocer password using email', async () => {
    const fakeMailProvider = new FakeMailProvider();
    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    const fakeUsersRepository = new FakeUsersRepository();
    const userData = {
      email: 'valid_email@mail.com',
      name: 'valid_name',
      password: 'valid_password',
    };
    await fakeUsersRepository.create(userData);

    const sut = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    await sut.execute({
      email: 'valid@email.com',
    });

    expect(sendMailSpy).toHaveReturned();
  });
});
