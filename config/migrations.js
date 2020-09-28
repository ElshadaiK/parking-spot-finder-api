const permissions = [
    'create user',
    'view any user',
    'view user',
    'update user',
    'remove user',

    'create company user',
    'view company user',
    'update company user',
    'remove company user',

    'create role',
    'view any role',
    'view role',
    'update role',
    'remove role',
]

const roles = {
    admin: [...permissions],
    user: [],
    manager: [
        'create company user',
        'view company user',
        'update company user',
        'remove company user',
    ],
    parking_officer: [
        'view company user'
    ]
}

const users = [
    {
        username: 'admin',
        email: 'super@admin.com',
        password: 'superuser',
        roles: ['admin']
    }
]

module.exports = { permissions, roles, users }
