const {User} = require('../../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid jsonwebtoken', () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin:true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivatekey'));
        expect(decoded).toMatchObject(payload)
    });
});
