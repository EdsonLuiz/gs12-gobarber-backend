import CreateAppointmentService from './CreateAppointmentService'
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository'


describe('CreateAppointmentService', () => {
  it('Should be abble to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'valid_id'
    })

    expect(appointment).toHaveProperty('id')
  })

  // it('Should not be abble to create two appointments at the same time', () => {

  // })
})

