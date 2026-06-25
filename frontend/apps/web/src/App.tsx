import Argumento from "./components/Argumento";
import Carta from "./components/Carta";
import Cita from "./components/Cita";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";
import Galeria from "./components/Galeria";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ReservaForm from "./components/ReservaForm";
import TiraFotos from "./components/TiraFotos";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <TiraFotos />
      <Argumento />
      <Cita />
      <Galeria />
      <Carta />
      <CtaBanner />
      <ReservaForm />
      <Footer />
    </>
  );
}
