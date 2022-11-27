// closure

function createIncreaseNumberFn() {
    let number = 0;

    return () => ++number;
}

const increaseNumber = createIncreaseNumberFn();

// recursion (saves us code and solves problems we could not solve using for loop)

function factorialOf(n) {
    if(n < 1) return 1;

    return n * factorialOf(n - 1);
}

function powerOf(x, n) {
    if(n < 1) return 1;

    return x * powerOf(x, n - 1);
}

const mySelf = {
    name: 'allmate',
    friends: [
        { name: 'bruce' },
        {
            name: 'clark',
            friends: [
                {
                    name: 'barry',
                    friends: [
                        {name: 'diana'}
                    ]
                }
            ]
        }
    ]
};

const nameList = [];

// the more friends you add, the more loops you need
for(const person of mySelf.friends) {
    nameList.push(person.name);

    if('friends' in person) {
        person.friends.forEach(person => {
            nameList.push(person.name);

            if('friends' in person) {
                // console.log(person.friends);
            }
        });
    }
}

// solving the problem by using recursion

function getFriendList(person) {
    const nameList = [];

    if(!person.friends) return [];

    for(const friend of person.friends) {
        nameList.push(friend.name);
        nameList.push(...getFriendList(friend));
    }

    return nameList;
}

console.log(getFriendList(mySelf));