import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import { useConversations } from '../contexts/ConversationsProvider';


export default function NewConversationModal({ closeModal })
{
    const { contacts } = useContacts();
    const [selectedContactIds, setselectedContactIds] = useState([]);
    const { createConversation } = useConversations();
    function handleCheckboxChange(contactId)
    {
        setselectedContactIds(prevSelectedContactIds =>
        {
            if (prevSelectedContactIds.includes(contactId))
            {
                return prevSelectedContactIds.filter(prevId =>
                {
                    return contactId !== prevId;
                });
            }
            else
            {
                return [...prevSelectedContactIds, contactId];
            }
        });
    }

    function handleSubmit(e)
    {
        e.preventDefault();
        createConversation(selectedContactIds);
        closeModal();
    }

    return (
        <>
            <Modal.Header>Create Conversation</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactIds.includes(contact.id)}
                                label={contact.name}
                                onChange={() => handleCheckboxChange(contact.id)}
                            />
                        </Form.Group>
                    ))}
                    <Button type='submit' className='mt-2 me-2'>Submit</Button>
                    <Button onClick={closeModal} variant="secondary" className='mt-2 mr-2'>Close</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
