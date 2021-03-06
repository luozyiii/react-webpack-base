import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { exclude } from './config';
import NotFount from '@/pages/404';

const About = React.lazy(() => import(/* webpackChunkName: "about" */ '@/pages/about'));

/**
 * 路由：约定式路由 + 懒加载路由
 * 约定式路由：核心API require.context， 自动识别 src/pages 目录下 .n.tsx 结尾的文件，生成对应的路由规则
 * 例如： "./index.n.tsx" => "/" ； "./home/index.n.tsx"  => "/home"
 */
function MyRouter() {
  const routerFiles: any = {};

  function importAll(r: any) {
    r.keys().forEach((key: any) => (routerFiles[key] = r(key)));
  }

  importAll(require.context('@/pages', true, /\.n\.tsx$/));
  let routesPaths = Object.keys(routerFiles).filter((path: string) => {
    let bl = true;
    exclude &&
      exclude.forEach((name) => {
        if (path.includes(name)) {
          bl = false;
        }
      });
    return bl;
  });
  // console.log('routesPaths:', routesPaths);

  /**
   * 文件路径转换成路由路径; 如下:
   *    "./index.n.tsx"       => "/"
   *    "./home/index.n.tsx"  => "/home"
   */
  const handlePath = (path: string) => {
    let lastPath = path.split('.')[1];
    let start = lastPath.indexOf('[');
    let end = lastPath.indexOf(']');
    if (lastPath === '/index') {
      lastPath = '/';
    } else if (lastPath.substring(lastPath.length - 6) === '/index') {
      lastPath = lastPath.substring(0, lastPath.length - 6);
    } else if (start && end && start < end) {
      lastPath = lastPath.replace('[', ':');
      lastPath = lastPath.replace(']', '');
    }
    return lastPath;
  };

  return (
    <BrowserRouter>
      <React.Suspense fallback={<p>Loading...</p>}>
        <Routes>
          {/* 约定式路由 */}
          {routesPaths.length &&
            routesPaths.map((p, key) => {
              let path = handlePath(p);
              let Element = routerFiles[p].default;
              return <Route key={key} path={path} element={<Element />} />;
            })}
          {/* 懒加载路由 */}
          <Route path="/about" element={<About />} />
          {/* 404路由 */}
          <Route path="*" element={<NotFount />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default MyRouter;
