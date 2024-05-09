const SERVER_URL = 'http://localhost:3000'

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(obj),
  })
  let data = await response.json()
  return data
}

async function serverGetStudent() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: {'Content-Type': 'application/json'}
  })
  let data = await response.json()
  return data
}

async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
    method: "DELETE"
  })
  let data = await response.json()
  return data
}

let serverData = await serverGetStudent()
// база данных
// let listData = [
  // {
  //   name: 'Маша',
  //   surname: 'Птичкина',
  //   lastname: 'Андреевна',
  //   birthday: new Date(1998, 6, 3),
  //   faculty: 'Инженерия',
  //   studyStart: 2021,
  // },
  // {
  //   name: 'Илья',
  //   surname: 'Иванов',
  //   lastname: 'Олегович',
  //   birthday: new Date(1994, 5, 12),
  //   faculty: 'Экономика',
  //   studyStart: 2010,
  // },
  // {
  //   name: 'Оля',
  //   surname: 'Студентова',
  //   lastname: 'Алксандровна',
  //   birthday: new Date(1991, 11, 18),
  //   faculty: 'Экономика',
  //   studyStart: 2011,
  // },
  // {
  //   name: 'Алексей',
  //   surname: 'Иванов',
  //   lastname: 'Сергеевич',
  //   birthday: new Date(2001, 9, 21),
  //   faculty: 'Поварское искусство',
  //   studyStart: 2022,
  // },
  // {
  //   name: 'Татьяна',
  //   surname: 'Ивановна',
  //   lastname: 'Олеговина',
  //   birthday: new Date(1997, 4, 1),
  //   faculty: 'Информатика',
  //   studyStart: 2016,
  // },
  // {
  //   name: 'Александр',
  //   surname: 'Вигура',
  //   lastname: 'Валерьевич',
  //   birthday: new Date(2002, 6, 16),
  //   faculty: 'Поварское искусство',
  //   studyStart: 2020,
  // }
// ]
let listData = []

if (serverData) {
  listData = serverData

}

function formatDate(date){ // дату рождения
  let newDate = new Date(date);
  let dd = newDate.getDate();
  if (dd < 10) {
      dd = '0' + dd;
  }
  let mm = newDate.getMonth() + 1; // месяц начинается с 0
  if (mm < 10) {
      mm = '0' + mm;
  }
  let yy = newDate.getFullYear();
  if (yy < 10) {
      yy = '0' + yy;
  }

  return dd + '.' + mm + '.' + yy;
}

let sortColumnFlag = 'fio',
  sortDirFlag = 'true'

// Создание элементов
const $app = document.getElementById('app'),
    $addForm = document.getElementById('add-form'),
    $surnameInp = document.getElementById('add-form__surname-inp'),
    $nameInp = document.getElementById('add-form__name-inp'),
    $lastnameInp = document.getElementById('add-form__lastname-inp'),
    $birthdayInp = document.getElementById('add-form__birthday-inp'),
    $facultyInp = document.getElementById('add-form__faculty-inp'),
    $studyStartInp = document.getElementById('add-form__start-inp'),

    $filterForm = document.getElementById('filter-form'),
    $fioFilterInp = document.getElementById('filter-form__fio-inp'),
    $facultyFilterInp = document.getElementById('filter-form__faculty-inp'),
    $studyStartFilterInp = document.getElementById('filter-form__start-inp'),

    $table = document.createElement('table'),
    $tableHead = document.createElement('thead'),
    $tableBody = document.createElement('tbody'),

    $tableHeadTr = document.createElement('tr'), // table row
    $tableHeadThFIO = document.createElement('th'), // table head
    $tableHeadThBirthday = document.createElement('th'),
    $tableHeadThFaculty = document.createElement('th'),
    $tableHeadThStudyStart = document.createElement('th'),
    $tableHeadThDelete = document.createElement('th');

// Class
$table.classList.add('table', 'table-striped', 'table-hover')

$tableHeadThFIO.textContent = 'ФИО'
$tableHeadThBirthday.textContent = 'Дата рождения + возраст'
$tableHeadThFaculty.textContent = 'Факультет'
$tableHeadThStudyStart.textContent = 'Год поступления'

$tableHeadTr.append($tableHeadThFIO)
$tableHeadTr.append($tableHeadThBirthday)
$tableHeadTr.append($tableHeadThFaculty)
$tableHeadTr.append($tableHeadThStudyStart)
$tableHeadTr.append($tableHeadThDelete)

$tableHead.append($tableHeadTr)
$table.append($tableHead)
$table.append($tableBody)
$app.append($table)

// Создание Tr одного пользователя
function createStudentTr(oneStudent) {
  const $studentTr = document.createElement('tr'), // table row
        $studentFIO = document.createElement('td'), // table head
        $studentBirthday = document.createElement('td'),
        $studentFaculty = document.createElement('td'),
        $studentStudyStart = document.createElement('td'),
        $tdDelete = document.createElement('td'),
        $btnDelete = document.createElement('button');

  $btnDelete.classList.add('btn', 'btn-danger', 'w-100');
  $btnDelete.textContent = 'Удалить';

  $studentFIO.textContent = oneStudent.fio
  $studentBirthday.textContent = oneStudent.birth
  $studentFaculty.textContent = oneStudent.faculty
  $studentStudyStart.textContent = oneStudent.studyStart

  $btnDelete.addEventListener("click", async function() {
    await serverDeleteStudent(oneStudent.id)
    $studentTr.remove()
  })

  $tdDelete.append($btnDelete)
  $studentTr.append($studentFIO, $studentBirthday, $studentFaculty, $studentStudyStart, $tdDelete)

  return $studentTr
}

// Фильтрация
function filter(arr, prop, value) { // prop = свойство
  return arr.filter(function(oneStudent) {
      if(oneStudent[prop].toString().toLowerCase().includes(value.trim().toLowerCase())) return true
  })
}

// Рендер
function render(arrData) {
  $tableBody.innerHTML = '';
  let copyListData = [...arrData];

  // 1. Подготовка
  for (const oneStudent of copyListData) {
    oneStudent.fio = oneStudent.surname + ' ' + oneStudent.name + ' ' + oneStudent.lastname
    function getAge(dateString){ // возраст
      const today = new Date();
    let birthDate = new Date(oneStudent.birthday); // тут тогда будет вводится не правильная дата рождения
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
    }

    const today = new Date();
    oneStudent.birth = formatDate(oneStudent.birthday) + ', (' + getAge(oneStudent.birthday) + ')'
    if(parseInt(oneStudent.studyStart) + 4 < today.getFullYear()) {
      if(!oneStudent.faculty.includes('(Закончил')) {
        oneStudent.faculty = oneStudent.faculty + ' (Закончил)'
      }
    } else {
      if(oneStudent.faculty.includes('курс)')) {
        oneStudent.faculty = oneStudent.faculty
      } else {

        if (!(today.getFullYear() - oneStudent.studyStart)) {
          oneStudent.faculty = oneStudent.faculty + ' (1 курс)'
        } else {
          oneStudent.faculty = oneStudent.faculty + ' (' + (today.getFullYear() - oneStudent.studyStart) + ' курс)'
        }
      }
    }
  }

  // Сортировка
  copyListData = copyListData.sort(function(a, b) {
      let sort = a[sortColumnFlag] < b[sortColumnFlag]
      if(!sortDirFlag) {
          sort = a[sortColumnFlag] > b[sortColumnFlag]
      }
      if(sort) return -1
  })

  // Фильтрация
  if($fioFilterInp.value.trim() !== '') {
      copyListData = filter(copyListData, 'fio', $fioFilterInp.value)
  }

  if($facultyFilterInp.value.trim() !== '') {
      copyListData = filter(copyListData, 'faculty', $facultyFilterInp.value)
  }

  if($studyStartFilterInp.value.trim() !== '') {
    copyListData = filter(copyListData, 'studyStart', $studyStartFilterInp.value)
  }

  // 2. отрисовка
  for (const oneStudent of copyListData) {
      const $newTr = createStudentTr(oneStudent)

      $tableBody.append($newTr)
  }
}
render(listData)

// Добавление (при нажатии на кнопку или Enter)
$addForm.addEventListener('submit', async function(event) {
  event.preventDefault()

  // Валидация
  if ($surnameInp.value.trim() === '') {
    alert('Фамилия не введена');
    return // просто return, чтобы функция закончилась
  }
  if ($nameInp.value.trim() === '') {
    alert('Имя не введено');
    return
  }
  if ($lastnameInp.value.trim() === '') {
    alert('Отчество не введено');
    return
  }
  if ($facultyInp.value.trim() === '') {
    alert('Факультет не введен');
    return
  }
  if ($birthdayInp.value.trim() === '') {
    alert('Возраст не введен');
    return
  }
  if ($studyStartInp.value.trim() === '') {
    alert('Год поступления не введен');
    return
  }

  // Подготовка
  let currentYear = (new Date()).getFullYear();
  const range = (studyStart, stop, step) => Array.from({ length: (stop - studyStart) / step + 1}, (_, i) => studyStart + (i * step));
  let arrOfYears = range(currentYear, 1900, -1);
  let birthday = new Date($birthdayInp.value.trim());
  let arrOfStudyStart = range(currentYear, 2000, -1);

  if (!arrOfYears.includes(birthday.getFullYear())) {
    alert('Не верный возраст');
    return
  }
  if (!arrOfStudyStart.includes(parseInt($studyStartInp.value.trim()))) {
    alert('Слишком давно было начато обучение');
    return
  }

  let serverDataObj = await serverAddStudent({
    name: $nameInp.value.trim(),
    surname: $surnameInp.value.trim(),
    lastname: $lastnameInp.value.trim(),
    birthday: new Date($birthdayInp.value.trim()),
    faculty: $facultyInp.value.trim(),
    studyStart: $studyStartInp.value.trim()
  })

  // очистка формы
  function cleanForm() {
    name: $nameInp.value = '';
    surname: $surnameInp.value = '';
    lastname: $lastnameInp.value = '';
    birthday: $birthdayInp.value = '';
    faculty: $facultyInp.value = '';
    studyStart: $studyStartInp.value = '';
  }

  listData.push(serverDataObj)
  console.log(listData);
  render(listData)
  cleanForm()
})

// событие сортировки
$tableHeadThFIO.addEventListener('click', function() {
  sortColumnFlag = 'fio'
  sortDirFlag = !sortDirFlag
  render(listData)
})

$tableHeadThBirthday.addEventListener('click', function() {
  sortColumnFlag = 'birthday'
  sortDirFlag = !sortDirFlag
  render(listData)
})

$tableHeadThFaculty.addEventListener('click', function() {
  sortColumnFlag = 'faculty'
  sortDirFlag = !sortDirFlag
  render(listData)
})

$tableHeadThStudyStart.addEventListener('click', function() {
  sortColumnFlag = 'studyStart'
  sortDirFlag = !sortDirFlag
  render(listData)
})

// Фильтр
$filterForm.addEventListener('submit', function(event) {
  event.preventDefault()
})

$fioFilterInp.addEventListener('input', function() {
  render(listData);
})

$facultyFilterInp.addEventListener('input', function() {
  render(listData);
})

$studyStartFilterInp.addEventListener('input', function() {
  render(listData);
})
