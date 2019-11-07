document.addEventListener("DOMContentLoaded", () => {
  let globalData;
  let changedData;
  let role = null;
  let type = null;
  let onSearch = false;
  const filterButtons_role = document.querySelectorAll('input[name="role"]');
  const filterButtons_type = document.querySelectorAll('input[name="type"]');
  const cardsContainer = document.querySelector('.main__cards');
  const search = document.querySelector('#search');

  const createCard = (data) => {
    let type;
    let role;
    switch (data.type.toLowerCase()) {
      case 'компьютер':
        type = 'computer';
        break;
      case 'телефон':
        type = 'phone';
        break;
      case 'ноутбук':
        type = 'laptop';
        break;
      case 'монитор':
        type = 'monitor';
        break;
      case 'сервер':
        type = 'server';
        break;
      default:
        break;
    }

    switch (data.role.toLowerCase()) {
      case 'владелец':
        role = 'owner';
        break;
      case 'пользователь':
        role = 'user';
        break;
      case 'пользователь-владелец':
        role = 'user-owner';
        break;
      default:
        break;
    }

    return `
      <div class="card__inner">
        <div class="card__role -${role}">Я ${data.role}</div>
        <h2 class="h2"><div class="typeImage -${type}"></div><span>${data.title}</span></h2>
        <div class="card__info info">
          <div class="info__item"><span class="info__title">Серийный номер</span><span class="info__text">${data.serial}</span></div>
          <div class="info__item"><span class="info__title">Код ЕНС</span><span class="info__text">${data.code_ehd}</span></div>
          <div class="info__item"><span class="info__title">Код СА</span><span class="info__text">${data.code_ca}</span></div>
          <div class="info__item"><span class="info__title">Инвентарный номер</span><span class="info__text">${data.inventory_num}</span></div>
        </div>
        <div class="card__lastActivity lastActivity">
          <div class="lastActivity__item"><span class="lastActivity__title">Последняя активность</span><span class="lastActivity__text">${data.last_activity}</span></div>
          <div class="lastActivity__item"><span class="lastActivity__title">Устройство у сотрудника</span><span class="lastActivity__text colorBlue">${data.owner_fio}</span></div>
        </div>
      </div>
    `;
  };

  const fillContainer = (newData) => {
    newData.forEach((item) => {
      if (!item) {
        return;
      }
      const newCard = document.createElement('div');
      newCard.classList.add('card');
      newCard.innerHTML = createCard(item);
      cardsContainer.appendChild(newCard);
    })
  };

  const clearContainer = () => {
    cardsContainer.innerHTML = "";
  };

  const setClickOnFilter = (buttons, field) => {
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        field === 'role' ? role = button.value : field === 'type' ? type = button.value : null;
        let dt;
        dt = globalData
        let newData;
        newData = dt.map((item) => {
          if (item) {
            if (!role) {
              if (item.type === type) {
                return item;
              }
            } else if (!type) {
              if (item.role === role) {
                return item;
              }
            } else if (item.role === role && item.type === type) {
              return item;
            }
          }
        });
        changedData.d = newData;
        changeState();
      });
    })
  };

  const setOnSearch = () => {
    search.addEventListener('keyup', (e) => {
      onSearch = !!e.target.value.length;
      let newData;
      newData = globalData.map((item) => {
        if (item && ~item.title.toLowerCase().indexOf(e.target.value.toLowerCase())) {
          return item;
        }
      });
      changedData.s = newData;
      changeState();
    });
  };

  const changeState = () => {
    let newArr = [];
    for (let i = 0; i < changedData.s.length; i++) {
      for (let j = 0; j < changedData.d.length; j++) {
        if (changedData.s[i] && changedData.d[j] && changedData.s[i].id === changedData.d[j].id) {
          newArr.push(changedData.d[j]);
        }
      }
    }
    clearContainer();
    fillContainer(newArr);
  };

  const getData = () => {
    fetch('/json/MOCK_DATA.json')
      .then(response => response.json())
      .then(result => {
        globalData = result;
        changedData = {
          d: [...globalData],
          s: [...globalData],
          lastFilter: null,
        };
        fillContainer(globalData);
        setClickOnFilter(filterButtons_role, 'role');
        setClickOnFilter(filterButtons_type, 'type');
        setOnSearch();
      });
  };
  getData();
});
