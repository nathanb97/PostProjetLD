import copy

def DistanceDeLevenshtein(mot1,mot2):
    coutSubstitution=0
    sous_d=[0]*(len(mot2)+1)
    d=[copy.copy(sous_d) for i in range (0,len(mot1)+1)]
    for i in range (0,len(mot1)+1):
        d[i][0]=i

    for i in range (0,len(mot2)+1):
        d[0][i]=i
    for i in range (1,len(mot1)+1):
            for j in range (1,len(mot2)+1):
                if(mot1[i-1] == mot2[j-1]):
                    coutSubstitution = 0
                else:
                    coutSubstitution = 1
                d[i][j]=min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+coutSubstitution)
    
    return d[len(mot1)][len(mot2)]

        
