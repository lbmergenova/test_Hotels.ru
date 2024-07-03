let users = [];
let currentID = 1;

const getUsers = () => {
    return users;
};

const addUser = (user) => {
    user.id = currentID++;
    users.push(user);
    return user;
};

const updateUser = (id, updateUser) => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users[userIndex] = {...users[userIndex], ...updateUser};
        return users[userIndex];
    }
    return undefined;
};

const getUserById = (id) => { return users.find(u => u.id === id)};

const deleteUser = (id) => {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return true;
    }
    return false;   
};

module.exports = {
    getUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
};