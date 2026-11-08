import { gql } from "@apollo/client"

export const VERIFY_USER = gql`
    query VerifyUser($token: String!) {
        user(token: $token) {
            id
            name
            email
            token
            organization {
                id
            }
        }
    }
`;

export const GET_EVENTS = gql`
    query Events($orgId: ID!) {
        events(orgId: $orgId) {
            id
            name_text
            name_html
            dsc_text
            dsc_html
            capacity
            start_utc
            end_utc
        }
    }
`;

export const GET_EVENT_BY_ID = gql`
    query Event($eventId: ID!) {
        event(id: $eventId) {
            id
            name_text
            name_html
            dsc_text
            dsc_html
            capacity
            start_utc
            end_utc
        }
    }
`;

export const DELETE_EVENT = gql`
    mutation DeleteEvent($eventId: ID!) {
        deleteEvent(id: $eventId) {
            message
            status
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($input: UpdateEvent!) {
        updateEvent(input: $input) {
            id
            name_text
            name_html
            dsc_text
            dsc_html
            capacity
            start_utc
            end_utc
        }
    }
`;

export const NEW_EVENT = gql`
    mutation AddEvent($input: NewEvent!) {
        addEvent(input: $input) {
            id
            name_text
            name_html
            dsc_text
            dsc_html
            capacity
            start_utc
            end_utc
        }
    }
`;
