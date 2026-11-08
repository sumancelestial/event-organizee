import { eventsRepo, usersRepo } from "../repos"

const organization = {
  async events(parent: any) {
    let evnts = await eventsRepo.find({
      where: {
        org: {
          id: parent.id
        }
      }
    })
    evnts = evnts.map((event)=>{
      event = {
        ...event,
        start_utc: new Date(event.start_utc).toISOString(),
        end_utc: new Date(event.end_utc).toISOString(),
      }
      return event
    })
    return evnts
  },

  async users(parent: any) {
    const users = await usersRepo.find({
      where: {
        org: {
          id: parent.id
        }
      }
    })
    return users
  }
}

export default organization