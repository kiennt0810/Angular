export const MENU = [
  

  // {
  //   id: '1',
  //   name: 'Quản lý đoàn vào',
  //   icon: './content/images/layout/sidebar/group-in-people.svg',
  //   path: '/doanVao',
  //   authorities: ['03000'],
  //   active: false,
  //   leaves: [
  //     {
  //       id: '2',
  //       parentId: '1',
  //       name: 'Quản lý hồ sơ đoàn vào',
  //       icon: './content/images/layout/sidebar/file-import-solid-svgrepo-com.svg',
  //       path: '/doanVao/quanLyDoanVao',
  //       authorities: ['03001'],
  //       active: false,
  //       leaves: null,
  //     },
  //     {
  //       id: '2',
  //       parentId: '1',
  //       name: 'Quản lý hồ sơ thành viên đoàn vào',
  //       icon: './content/images/layout/sidebar/document-business.svg',
  //       path: '/doanVao/quanLyTV',
  //       authorities: ['03002'],
  //       active: false,
  //       leaves: null,
  //     },
  //   ],
  // },
  // {
  //   id: '11',
  //   name: 'Quản lý đoàn ra',
  //   icon: './content/images/layout/sidebar/group-out-people.svg',
  //   path: '/doanRa',
  //   authorities: ['04000'],
  //   active: false,
  //   leaves: [
  //     {
  //       id: '12',
  //       parentId: '11',
  //       name: 'Quản lý hồ sơ đoàn ra',
  //       icon: './content/images/layout/sidebar/file-export-solid-svgrepo-com.svg',
  //       path: '/doanRa/quanLyDoanRa',
  //       authorities: ['04001'],
  //       active: false,
  //       leaves: null,
  //     },
  //     {
  //       id: '13',
  //       parentId: '11',
  //       name: 'Quản lý hồ sơ thành viên đoàn ra',
  //       icon: './content/images/layout/sidebar/document-business.svg',
  //       path: '/doanRa/quanLyTVRa',
  //       authorities: ['04002'],
  //       active: false,
  //       leaves: null,
  //     },
  //   ],
  // },
  {
    id: '53',
    name: 'Quản lý hộ chiếu',
    icon: './content/images/layout/sidebar/passport-svgrepo-com.svg',
    path: '/HoChieu',
    authorities: ['07000'],
    active: false,
    leaves: [
      {
        id: '53',
        parentId: '52',
        name: 'Quản lý hộ chiếu ngoại giao/công vụ',
        icon: './content/images/layout/sidebar/passport-svgrepo.svg',
        path: '/HoChieu/quanlyHCNgoaiGiao',
        authorities: ['07001'],
        active: false,
        leaves: null,
      },
      {
        id: '54',
        parentId: '52',
        name: 'Quản lý giao nhận hộ chiếu',
        icon: './content/images/layout/sidebar/carnet-svgrepo-com.svg',
        path: '/HoChieu/GiaoNhanHC',
        authorities: ['07002'],
        active: false,
        leaves: null,
      },
      {
        id: '55',
        parentId: '52',
        name: 'Kiểm tra hộ chiếu theo danh sách',
        icon: './content/images/layout/sidebar/file-search-svgrepo-com.svg',
        path: '/HoChieu/KiemTraHC',
        authorities: ['07003'],
        active: false,
        leaves: null,
      },
    ],
  },
  {
    id: '41',
    name: 'Quản trị hệ thống',
    icon: './content/images/layout/sidebar/setting-2-svgrepo-com.svg',
    path: '/quantrihethong',
    authorities: ['01000'],
    active: false,
    leaves: [
      {
        id: '42',
        parentId: '41',
        name: 'Quản lý người sử dụng',
        icon: './content/images/layout/sidebar/person-svgrepo-com.svg',
        path: '/quantrihethong/quanlynguoisudung',
        authorities: ['01001'],
        active: false,
        leaves: null,
      },
      {
        id: '42',
        parentId: '41',
        name: 'Quản lý nhóm người sử dụng',
        icon: './content/images/layout/sidebar/group-svgrepo-com.svg',
        path: '/quantrihethong/HTNhom',
        authorities: ['01002'],
        active: false,
        leaves: null,
      },
      {
        id: '43',
        parentId: '41',
        name: 'Quản lý phân nhóm NSD',
        icon: './content/images/layout/sidebar/usergroup-add-svgrepo-com.svg',
        path: '/quantrihethong/HTNhomNhanVien',
        authorities: ['01003'],
        active: false,
        leaves: null,
      },
      {
        id: '44',
        parentId: '41',
        name: 'Quản lý phân quyền chức năng',
        icon: './content/images/layout/sidebar/security-user-svgrepo-com.svg',
        path: '/quantrihethong/HTQuyen',
        authorities: ['01004'],
        active: false,
        leaves: null,
      },
      {
        id: '45',
        parentId: '41',
        name: 'Đổi mật khẩu',
        icon: './content/images/layout/sidebar/password-cursor-svgrepo-com.svg',
        path: '/quantrihethong/ChangePassword',
        authorities: ['01005'],
        active: false,
        leaves: null,
      },
      
    ],
  },
  {
    id: '29',
    name: 'Danh mục',
    icon: './content/images/layout/sidebar/document-filled-svgrepo-com.svg',
    path: '/quanlydanhmuc',
    authorities: ['02000'],
    active: false,
    leaves: [
      {
        id: '31',
        parentId: '29',
        name: 'Danh mục Quốc gia và vùng lãnh thổ',
        icon: './content/images/layout/sidebar/earth-global.svg',
        path: '/quanlydanhmuc/quocgiavavunglanhtho',
        authorities: ['02001'],
        active: false,
        leaves: null,
      },
      {
        id: '40',
        parentId: '29',
        name: 'Danh mục dung lượng',
        icon: './content/images/layout/sidebar/passport-free.svg',
        path: '/quanlydanhmuc/storage',
        authorities: ['02000'],
        active: false,
        leaves: null,  
      },
      {
        id: '99',
        parentId: '29',
        name: 'Danh mục màu',
        icon: './content/images/layout/sidebar/document-check-svgrepo-com.svg',
        path: '/quanlydanhmuc/color',
        authorities: ['02000'],
        active: false,
        leaves: null,
      },
      {
        id: '99',
        parentId: '29',
        name: 'Danh mục thương hiệu',
        icon: './content/images/layout/sidebar/document-check-svgrepo-com.svg',
        path: '/quanlydanhmuc/brand',
        authorities: ['02000'],
        active: false,
        leaves: null,
      },
    ],
  },
  {
    id: '53',
    name: 'Quản lý sản phẩm',
    icon: './content/images/layout/sidebar/passport-svgrepo-com.svg',
    path: '/product',
    authorities: ['03000'],
    active: false,
    leaves: [],
  },
  {
    id: '55',
    name: 'Quản lý khách hàng',
    icon: './content/images/layout/sidebar/passport-svgrepo-com.svg',
    path: '/customer',
    authorities: ['05000'],
    active: false,
    leaves: [],
  },
];
