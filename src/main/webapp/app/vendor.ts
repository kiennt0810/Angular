/* after changing this file run 'npm run webpack:build' */
/* tslint:disable */
import '../content/scss/vendor.scss';

// Imports all fontawesome core and solid icons

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faQuestionCircle,
  faArrowCircleRight,
  faUser,
  faSort,
  faSortUp,
  faHourglassStart,
  faSortDown,
  faExclamationTriangle,
  faSitemap,
  faUsers,
  faSync,
  faEye,
  faEyeSlash,
  faBan,
  faTimes,
  faTimesCircle,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faArrowDown,
  faSave,
  faPlus,
  faPlusSquare,
  faEyeDropper,
  faUnlockAlt,
  faPencilAlt,
  faBars,
  faThList,
  faUserPlus,
  faRoad,
  faTachometerAlt,
  faHeart,
  faList,
  faBell,
  faShareAlt,
  faBook,
  faHdd,
  faFlag,
  faWrench,
  faLock,
  faCloud,
  faCloudUploadAlt,
  faCloudDownloadAlt,
  faSignOutAlt,
  faSignInAlt,
  faCalendarAlt,
  faSearch,
  faTrashAlt,
  faAsterisk,
  faTasks,
  faHome,
  faWindowClose,
  faFileWord,
  faFileExcel,
  faFilePdf,
  faStarOfDavid,
  faUserCircle,
  faArrowAltCircleRight,
  faPenSquare,
  faSuitcase,
  faUserTag,
  faFolder,
  faFolderOpen,
  faRibbon,
  faFastBackward,
  faLevelDownAlt,
  faNewspaper,
  faGlobe,
  faFastForward,
  faStepBackward,
  faStepForward,
  faExpandArrowsAlt,
  faCheckSquare,
  faSquare,
  faEnvelope,
  faCheckCircle,
  faPlusCircle,
  faCalendar,
  faEdit,
  faAngleLeft,
  faAngleRight,
  faCaretDown,
  faCaretUp,
  faClock,
  faClone,
  faAngleUp,
  faAngleDown,
  faBold,
  faItalic,
  faFile,
  faCopy,
  faHistory,
  faDownload,
  faCheck,
  faCalendarTimes,
  faHourglass,
  faFileAlt,
  faPenAlt,
  faTrash,
  faFileImport,
  faExclamationCircle,
  faMinusCircle,
  faEllipsisV,
  faEllipsisH,
  faPrint,
  faMinus,
  faRedo,
  faAlignLeft,
  faAlignRight,
  faAlignCenter,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faCamera,
  faCameraRetro,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';

// Adds the SVG icon to the library so you can use it in your page
library.add(faNewspaper);
library.add(faExclamationTriangle);
library.add(faArrowCircleRight);
library.add(faArrowAltCircleRight);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faFolder);
library.add(faGlobe);
library.add(faQuestionCircle);
library.add(faTimesCircle);
library.add(faClone);
library.add(faShareAlt);
library.add(faClock);
library.add(faLevelDownAlt);
library.add(faEnvelope);
library.add(faUser);
library.add(faEyeDropper);
library.add(faUsers);
library.add(faHourglassStart);
library.add(faSort);
library.add(faSuitcase);
library.add(faPlusCircle);
library.add(faUnlockAlt);
library.add(faSortUp);
library.add(faSortDown);
library.add(faPlusSquare);
library.add(faSync);
library.add(faSitemap);
library.add(faEye);
library.add(faEyeSlash);
library.add(faBan);
library.add(faTimes);
library.add(faArrowLeft);
library.add(faArrowRight);
library.add(faArrowUp);
library.add(faArrowDown);
library.add(faSave);
library.add(faPlus);
library.add(faPencilAlt);
library.add(faBars);
library.add(faHome);
library.add(faThList);
library.add(faUserPlus);
library.add(faRoad);
library.add(faTachometerAlt);
library.add(faHeart);
library.add(faList);
library.add(faBell);
library.add(faTasks);
library.add(faBook);
library.add(faHdd);
library.add(faFlag);
library.add(faWrench);
library.add(faLock);
library.add(faCloud);
library.add(faCloudUploadAlt);
library.add(faCloudDownloadAlt);
library.add(faSignOutAlt);
library.add(faSignInAlt);
library.add(faCalendarAlt);
library.add(faSearch);
library.add(faTrashAlt);
library.add(faAsterisk);
library.add(faWindowClose);
library.add(faFileWord);
library.add(faFileExcel);
library.add(faFilePdf);
library.add(faStarOfDavid);
library.add(faUserCircle);
library.add(faPenSquare);
library.add(faUserTag);
library.add(faRibbon);
library.add(faFastBackward);
library.add(faFastForward);
library.add(faStepBackward);
library.add(faStepForward);
library.add(faExpandArrowsAlt);
library.add(faCheckSquare);
library.add(faSquare);
library.add(faCheckCircle);
library.add(faCalendar);
library.add(faEdit);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faAngleUp);
library.add(faAngleDown);
library.add(faBold);
library.add(faItalic);
library.add(faFile);
library.add(faCopy);
library.add(faHistory);
library.add(faDownload);
library.add(faCheck);
library.add(faCalendarTimes);
library.add(faHourglass);
library.add(faFileAlt);
library.add(faPenAlt);
library.add(faTrash);
library.add(faFileImport);
library.add(faExclamationCircle);
library.add(faMinusCircle);
library.add(faFolderOpen);
library.add(faEllipsisV);
library.add(faEllipsisH);
library.add(faPrint);
library.add(faMinus);
library.add(faRedo);
library.add(faAlignLeft);
library.add(faAlignRight);
library.add(faAlignCenter);
library.add(faAngleDoubleLeft);
library.add(faAngleDoubleRight);
library.add(faCamera);
library.add(faCameraRetro);
library.add(faAddressCard);
// jhipster-needle-add-element-to-vendor - JHipster will add new menu items here
