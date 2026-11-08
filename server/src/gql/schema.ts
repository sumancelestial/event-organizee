const typeDefs = `#graphql
  type Organization {
    id: ID!
    name: String!
    created: String!
    events: [Event!]
    users: [User!]
  }

  type User {
    id: ID!
    name: String!
    first_name: String!
    last_name: String!
    email: String!
    token: String!
    organization: Organization!
  }

  type Event {
    id: ID!
    name_text: String!
    name_html: String!
    dsc_text: String!
    dsc_html: String!
    capacity: Int!
    start_utc: String!
    end_utc: String!
    organization: Organization!
  }

  type DeleteMsg {
    message: String!
    status: String!
  }

  type Query {
    events(orgId: ID!): [Event!]
    event(id: ID!): Event
    user(token: String!): User
  }

  type Mutation {
    addEvent(input: NewEvent!): Event
    deleteEvent(id: ID!): DeleteMsg
    updateEvent(input: UpdateEvent!): Event
  }

  input NewEvent {
    name_text: String!
    name_html: String!
    dsc_text: String!
    dsc_html: String!
    capacity: Int!
    start_utc: String!
    end_utc: String!
    orgId: Int!
  }

  input UpdateEvent {
    id: ID!
    name_text: String!
    name_html: String!
    dsc_text: String!
    dsc_html: String!
    capacity: Int!
  }
`;

export default typeDefs;