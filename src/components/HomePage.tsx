import Search from './Search';

type HomePageProps = {
  onSearch: (query: string) => void;
};

function HomePage({ onSearch }: HomePageProps) {
  return (
    <section className="home-content" id="overview" aria-label="Главная">
      <div className="home-brand" aria-label="Deadlock Buff">
        <span className="home-brand-mark" aria-hidden="true">D</span>
        <h1 className="home-brand-name">deadlock<span>buff</span></h1>
      </div>
      <Search
        onSearch={onSearch}
        placeholder="Введите ID игрока"
      />
    </section>
  );
}

export default HomePage;
