import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import CreateUserService from '@modules/users/services/CreateUserService'
import AppError from '@shared/errors/AppError'

const makeSut = (): CreateUserService => {
  const fakeUsersRepository  = new FakeUsersRepository()
  return new CreateUserService(fakeUsersRepository)
}

const fakeUserData = {
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid_password'
}

describe('CreateUserService', () => {
  it('Should be able to create a new user', async () => {
    const sut = makeSut()

    const response = await sut.execute(fakeUserData)

    expect(response).toHaveProperty('id')
  })

  it('Should not be able to create a new user with same email', async () => {
    const sut = makeSut()

    await sut.execute(fakeUserData)
    const promise = sut.execute(fakeUserData)

    await expect(promise).rejects.toBeInstanceOf(AppError)  
  })

})

