const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

const contactsPath = path.join('db', 'contacts.json');

/**
 * read all contacts
 * @returns {Array}
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Contact list error:', error.message);
  }
}

/**
 * get contact by contact ID
 * @param {String or Number} - contactId
 * @returns {Object or Null}
 */
async function getContactById(contactId) {
  try {
    const data = await listContacts();
    const contactById = data.find(contact => contact.id == contactId);
    return contactById ? contactById : null;
  } catch (error) {
    console.log('Read by ID error:', error.message);
  }
}

/**
 * delete contact by contact ID
 * @param {String or Number} - contactId
 * @returns {Object or Null}
 */

async function removeContact(contactId) {
  try {
    const data = await listContacts();
    const contactToRemove = data.find(contact => contact.id == contactId);
    if (!contactToRemove) {
      return null;
    }

    const filteredContacts = data.filter(contact => contact.id != contactId);
    await fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    return contactToRemove;
  } catch (error) {
    console.log('Delete error:', error.message);
  }
}

/**
 * add contact to db
 * @param {String} - name, email, phone
 * @returns {Object}
 */

async function addContact(name, email = null, phone = null) {
  if (!name) return console.log('at least name is required');
  const contactToAdd = { id: uuidv4(), name, email, phone };

  try {
    const data = await listContacts();
    data.push(contactToAdd);
    await fs.writeFile(contactsPath, JSON.stringify(data));
    return contactToAdd;
  } catch (error) {
    console.log('Add error:', error.message);
  }
}
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  contactsPath,
};
