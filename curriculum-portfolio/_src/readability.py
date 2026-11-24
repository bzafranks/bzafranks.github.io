"""Flesch-Kincaid grade estimate: readability.py FILE  (plain text). Heuristic syllable counter; an estimate only."""
import re, sys
def syl(w):
    w = w.lower()
    w = re.sub(r'[^a-z]', '', w)
    if not w: return 0
    if len(w) <= 3: return 1
    w = re.sub(r'(?:[^laeiouy]es|ed|[^laeiouy]e)$', '', w)
    w = re.sub(r'^y', '', w)
    n = len(re.findall(r'[aeiouy]{1,2}', w))
    return max(1, n)
def fk(t):
    sents = [s for s in re.split(r'[.!?]+', t) if re.search(r'[A-Za-z]', s)]
    words = re.findall(r"[A-Za-z][A-Za-z'’-]*", t)
    sy = sum(syl(w) for w in words)
    W, S = len(words), len(sents)
    return W, S, round(0.39*W/S + 11.8*sy/W - 15.59, 1)
if __name__ == '__main__':
    t = open(sys.argv[1]).read()
    W, S, g = fk(t)
    print(f"words={W} sentences={S} FK_grade={g} words/sentence={W/S:.1f}")
