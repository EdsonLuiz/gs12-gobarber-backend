import CreateAppointmentService from './CreateAppointmentService'
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'
import AppError from '@shared/errors/AppError'

const makeSut = ():CreateAppointmentService => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
    return createAppointment
}

const appointmentData = {
  date: new Date(),
  provider_id: 'valid_id'
}


describe('CreateAppointmentService', () => {

  it('Should be able to create new appointment with correct values', async () => {
    const sut = makeSut()
    const createAppointmentServiceSpy = jest.spyOn(sut, 'execute')

    const appointmentData = {
      date: new Date(),
      provider_id: 'valid_id'
    }

    await sut.execute(appointmentData)

    expect(createAppointmentServiceSpy).toHaveBeenCalledWith(appointmentData)
  })

  it('Should be abble to create a new appointment', async () => {
    const createAppointment = makeSut()

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'valid_id'
    })

    expect(appointment).toHaveProperty('id')
  })

  it('Should not be abble to create two appointments at the same time', async () => {
    const createAppointment = makeSut()


    await createAppointment.execute(appointmentData)
    
    const promise =  createAppointment.execute(appointmentData)

    await expect(promise).rejects.toBeInstanceOf(AppError)

  })
})
